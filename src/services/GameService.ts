import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { WebSocket, WebSocketBehavior } from 'uWebSockets.js';
import config from '../utils/config';
import Game, { GameState } from '../game/Game';
import { GameSetting, Player, ShipPlacement } from '../game/types';
import { DefaultSettings } from '../game/Board';
import ValidationError from './errors/ValidationError';
import EntityNotFoundError from './errors/EntityNotFoundError';
import type { WSAuthTicket } from '../models/WSAuthTicket';
import type ActiveGame from '../models/ActiveGame';
import type { GameCreatedResult } from '../graphql/types/GameCreatedResult';
import type { User } from '../models/User';
import type { GameJoinedResult } from '../graphql/types/GameJoinedResult';
import { WSState, type WSData } from '../models/WSData';
import { assertNever } from '../utils/typeUtils';

/**
 * Registry of active game instances, indexed by game Id's
 */
const activeGames: Map<string, ActiveGame> = new Map<string, ActiveGame>();

/**
 * Registry of game invite codes, each key is an invite code, and is mapped to a
 * corresponding game id
 */
const inviteCodes: Map<string, string> = new Map<string, string>();

const gameExists = (id: string): boolean => activeGames.has(id);

const getGame = (id: string): ActiveGame => {
  const game = activeGames.get(id);
  if (!game) {
    throw new EntityNotFoundError('Game', id);
  }

  return game;
};

/**
 * Generate a new unique game id.
 *
 * @returns A string representing a unique game id.
 */
const generateGameId = (): string => {
  let id = randomUUID();

  while (gameExists(id)) {
    id = randomUUID();
  }

  return id;
};

/**
 * Create a game invite code. This method will create a unique, pseudo-random,
 * 'human-readable' six-digit invite code and associate the provided game Id with it.
 *
 * @param gameId Id of the game for which the invite code is to be generated.
 * @returns The generated invite code.
 */
const createInviteCode = (gameId: string): string => {
  // generate a random number between 100_000 and 999_999 ...
  let number = (100_000 + Math.random() * 900_000);
  // round it, and convert to string
  let code = Math.floor(number).toString();

  while (inviteCodes.has(code)) {
    // repeat the process if the geenrated code happens to already exist
    number = (100_000 + Math.random() * 900_000);
    code = Math.floor(number).toString();
  }

  // save the code and associate the game id to it
  inviteCodes.set(code, gameId);

  return code;
};

const createWSAuthCode = (ticket: WSAuthTicket): string => {
  // create the token with an expiration claim
  const token = jwt.sign(
    ticket,
    config.JWT_SECRET,
    {
      expiresIn: config.WS_AUTH_TICKET_LIFETIME_SECONDS,
    },
  );

  return token;
};

const verifyWSAuthCode = (code: string): WSAuthTicket | false => {
  try {
    const payload = jwt.verify(code, config.JWT_SECRET);
    if (typeof payload === 'object'
      && 'username' in payload
      && 'gameID' in payload) {
      return {
        username: payload.username,
        gameID: payload.gameID,
      };
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * Create a new game.
 *
 * @param user The User creating the game - will be considered the created games 'owner'
 * @returns A GameCreatedResult which includes the newly created games Id, an invite
 *          code to invite another user to the created Game, and a wsAuthCode to initiate
 *          a websocket connection
 */
const createNewGame = (user: User): GameCreatedResult => {
  const id = generateGameId();
  const inviteCode = createInviteCode(id);
  const gameInstance = new Game(Player.Player1, DefaultSettings);

  // Set the owner user to the passed-in user entity,
  // userP2 is set to null until the second user joins
  const game: ActiveGame = {
    id,
    userP1: user,
    gameInstance,
  };

  activeGames.set(id, game);

  const wsAuthCode = createWSAuthCode({ username: user.username, gameID: id });

  return {
    gameId: id,
    inviteCode,
    wsAuthCode,
  };
};

/**
 * Let's a User join an existing Game using an invite code.
 * Throws an error if the invite code is invalid, or someone else
 * already joined the game.
 *
 * @param inviteCode The invite code
 * @param user The user attempting to join the game
 * @returns A GameJoinedResult which includes the games Id and a wsAuthCode which can be used
 *          to initiate a websocket connection
 */
const joinWithInviteCode = (inviteCode: string, user: User): GameJoinedResult => {
  // find the corresponding game id for the invite code
  const gameId = inviteCodes.get(inviteCode);
  if (!gameId) {
    throw new EntityNotFoundError('Game', inviteCode);
  }

  // delete the invite code
  inviteCodes.delete(inviteCode);

  // find the game instance for the retrieved game id
  const game = getGame(gameId);

  // check that the game hasn't advanced past the Created state
  if (game.gameInstance.getGameState() !== GameState.Created) {
    throw new Error('Cannot join a game which is not in the Created state');
  }

  // make sure that the user who created the game doesn't join as player 2
  if (game.userP1.id === user.id) {
    throw new Error('Cannot join game - you have already joined this game');
  }

  // check that a second player hasn't joined already
  if (game.userP2) {
    throw new Error('Cannot join game - a player already joined');
  }

  // 'join' the player to the game
  game.userP2 = user;

  const wsAuthCode = createWSAuthCode({ username: user.username, gameID: game.id });

  return {
    gameId: game.id,
    wsAuthCode,
  };
};

// eslint-disable-next-line arrow-body-style
const getGameSettings = (gameId: string): GameSetting => {
  return getGame(gameId).gameInstance.getGameSettings();
};

const placeShips = (user: User, gameId: string, shipPlacements: ShipPlacement[]): GameState => {
  const game = getGame(gameId);

  if (game.gameInstance.getGameState() !== GameState.Created) {
    throw new Error('Game has already been initialized');
  }

  const placementErrors = game.gameInstance.verifyShipPlacements(shipPlacements);
  if (placementErrors.length !== 0) {
    throw new ValidationError(`Invalid ship placements:\n${placementErrors}`);
  }

  if (user.id === game.userP1.id) {
    if (game.p1Placements) throw new Error('Player has already placed their ships');

    game.p1Placements = [...shipPlacements];
  } else if (user.id === game.userP2?.id) {
    if (game.p2Placements) throw new Error('Player has already placed their ships');

    game.p2Placements = [...shipPlacements];
  } else {
    throw new Error(`User '${user.username}' is not part of game id=${gameId}`);
  }

  if (game.p1Placements && game.p2Placements) {
    game.gameInstance.initialize(game.p1Placements, game.p2Placements);
    // wsApp.publish(game.id, 'GAME INITIALIZED');
  }

  return game.gameInstance.getGameState();
};

const messageDecoder = new TextDecoder();

const handleErrorState = (ws: WebSocket<WSData>): void => {
  let { errorMessage } = ws.getUserData();
  let code = 400;

  if (!errorMessage) {
    errorMessage = 'Unknown error';
    code = 500;
  }

  ws.send(JSON.stringify({ error: errorMessage }));
  ws.end(code);
};

const handleAuthMessage = (ws: WebSocket<WSData>, message: ArrayBuffer): void => {
  // decode the access code from raw data
  const decoded = messageDecoder.decode(message);
  // get the ws UserData
  const wsData = ws.getUserData();
  let errorMessage;

  if (wsData.state !== WSState.Unauthenticated) {
    errorMessage = 'Authentication failed - ws connection in wrong state';
  } else {
    try {
      // try to decode the access code
      const ticket = verifyWSAuthCode(decoded);
      if (ticket
        && ticket.gameID === wsData.gameID
        && ticket.username === wsData.username) {
        // if the access code is valid, and the decoded username and gameID
        // match the ones saved in ws UserData, get the game instance
        const game = getGame(wsData.gameID);

        // save the ws instance in the right place in the game instance
        // and set the ws state to Open
        if (wsData.username === game.userP1.username) {
          game.p1socket = ws;
          wsData.state = WSState.Open;
          // if the opponent is already connected, set its opponent
          // ws reference to this ws
          if (game.p2socket) {
            game.p2socket.getUserData().opponentWS = ws;
          }

          ws.send('Auth OK');
        } else if (wsData.username === game.userP2?.username) {
          // analogous to the userP1 case
          game.p2socket = ws;
          wsData.state = WSState.Open;
          if (game.p1socket) {
            game.p1socket.getUserData().opponentWS = ws;
          }

          ws.send('Auth OK');
        } else {
          errorMessage = 'Authentication failed - player is not part of game';
        }
      } else {
        errorMessage = 'Authentication failed - invalid ticket';
      }
    } catch {
      errorMessage = 'Authentication failed - invalid token';
    }
  }

  if (errorMessage) {
    wsData.state = WSState.Error;
    wsData.errorMessage = errorMessage;
    handleErrorState(ws);
  }
};

const handleMessage = (ws: WebSocket<WSData>, message: ArrayBuffer): void => {
  const wsData = ws.getUserData();
  const decoded = messageDecoder.decode(message);
  // for now just pass on the message, not really processing it yet
  if (wsData.opponentWS) {
    wsData.opponentWS.send(`Message from ${wsData.username}: '${decoded}'`);
  } else {
    ws.send('Message received, opponent not connected yet');
  }
};

export const WsHandler: WebSocketBehavior<WSData> = {
  upgrade: (res, req, context) => {
    // this WebSocketBehaviour should be registered for routes matching the
    // pattern '/game/:gameId/:username', so the two parameters are read from
    // the request
    const gameID = req.getParameter(0);
    const username = req.getParameter(1);
    let opponentWS;

    // do some checks before upgrading the request to websockets
    let errorMessage: string | null = null;
    try {
      // try to find the game for the given gameId
      const game = getGame(gameID);

      // make sure the given username is part of the game
      if (game.userP1.username !== username && game.userP2?.username !== username) {
        errorMessage = 'Bad url parameters';
      }

      if (game.userP1.username === username) {
        // make sure a ws connection isn't already open for the user
        if (game.p1socket) {
          errorMessage = 'Websocket for player/game combo already open';
        }

        // get a reference to the opponents websocket connetion (might still be null)
        opponentWS = game.p2socket;
      } else if (game.userP2?.username === username) {
        // make sure a ws connection isn't already open for the user
        if (game.p2socket) {
          errorMessage = 'Websocket for player/game combo already open';
        }

        // get a reference to the opponents websocket connetion (might still be null)
        opponentWS = game.p1socket;
      }
    } catch {
      // if no game is found, catch the error thrown by getGame()
      errorMessage = 'Bad url parameters';
    }

    // initialize an instance of user data for the new socket
    // the gameId, username, and opponentWs are saved per socket
    // at this point, opponentWS might be undefined (if the opponent hasn't opened
    // a ws yet)
    const socketData: WSData = {
      state: WSState.Error,
      gameID,
      username,
      opponentWS,
    };

    if (errorMessage) {
      // if an error has been found save the error in the sockets userData,
      // so it can be sent to the client after the ws connection is opened,
      socketData.state = WSState.Error;
      socketData.errorMessage = errorMessage;
    } else {
      // if no errors have been found, set the socket state to Unauthenticated
      socketData.state = WSState.Unauthenticated;
    }

    // Upgrade the connection and pass the created WSData as the userData parameter
    // for the websocket instance
    res.upgrade(
      socketData,
      req.getHeader('sec-websocket-key'),
      req.getHeader('sec-websocket-protocol'),
      req.getHeader('sec-websocket-extensions'),
      context,
    );
  },

  open: (ws) => {
    // on connection open, check if the ws user data is in an
    // error state, and if so, handle the error state (meaning send the 
    // error message and close the connection)
    if (ws.getUserData().state === WSState.Error) {
      handleErrorState(ws);
    }
  },

  message: (ws, message) => {
    const wsData = ws.getUserData();

    // handle the message according to the ws state saved is UserData
    switch (wsData.state) {
      case WSState.Error:
        handleErrorState(ws);
        break;
      case WSState.Unauthenticated:
        handleAuthMessage(ws, message);
        break;
      case WSState.Open:
        handleMessage(ws, message);
        break;
      default:
        assertNever(wsData.state);
    }
  },
};

export default {
  createNewGame,
  joinWithInviteCode,
  gameExists,
  getGameSettings,
  placeShips,
};
