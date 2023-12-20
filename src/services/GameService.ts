import { randomUUID } from 'crypto';
import { WebSocket } from 'uWebSockets.js';
import AuthService from './AuthService';
import Game, { GameState } from '../game/Game';
import {
  GameSetting, MoveResult, Player, ShipPlacement,
} from '../game/types';
import { DefaultSettings } from '../game/Board';
import ValidationError from './errors/ValidationError';
import EntityNotFoundError from './errors/EntityNotFoundError';
import type ActiveGame from '../models/ActiveGame';
import type { GameCreatedResult } from '../graphql/types/GameCreatedResult';
import type { User } from '../models/User';
import type { GameJoinedResult } from '../graphql/types/GameJoinedResult';
import { WSData } from '../models/WSData';
import { GameStartedMessage, MessageCode } from '../ws/MessageTypes';

/**
 * Registry of active game instances, indexed by game Id's
 */
const activeGames: Map<string, ActiveGame> = new Map<string, ActiveGame>();

/**
 * Registry of game invite codes, each key is an invite code, and is mapped to a
 * corresponding game id
 */
const inviteCodes: Map<string, string> = new Map<string, string>();

/**
 * Check if a game exists.
 *
 * @param id Id of the game to check.
 * @returns true if a game with the given Id exists, false otherwise
 */
const gameExists = (id: string): boolean => activeGames.has(id);

/**
 * Get a reference to an ActiveGame containing a Game instance with the
 * given Id.
 * @param id Id of the active game to find.
 * @returns The ActiveGame reference, or throws an EntityNotFoundError if no game is
 *          found for the given Id.
 */
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
const generateGameID = (): string => {
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
 * @param gameID Id of the game for which the invite code is to be generated.
 * @returns The generated invite code.
 */
const createInviteCode = (gameID: string): string => {
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
  inviteCodes.set(code, gameID);

  return code;
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
  const id = generateGameID();
  const inviteCode = createInviteCode(id);
  const gameInstance = new Game(Player.Player1, DefaultSettings);

  // Set the owner user to the passed-in user entity,
  // userP2 is set to null until the second user joins
  const game: ActiveGame = {
    id,
    userP1: user,
    gameInstance,
    p1socket: null,
    p2socket: null,
  };

  activeGames.set(id, game);

  const wsAuthCode = AuthService.encodeWSToken({ username: user.username, gameID: id });

  return {
    gameId: id,
    inviteCode,
    wsAuthCode,
  };
};

/**
 * Lets a User join an existing Game using an invite code.
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
  const gameID = inviteCodes.get(inviteCode);
  if (!gameID) {
    throw new EntityNotFoundError('Game', inviteCode);
  }

  // delete the invite code
  inviteCodes.delete(inviteCode);

  // find the game instance for the retrieved game id
  const game = getGame(gameID);

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

  const wsAuthCode = AuthService.encodeWSToken({ username: user.username, gameID: game.id });

  return {
    gameId: game.id,
    wsAuthCode,
  };
};

/**
 * Get the GameSettings for a Game instance.
 * @param gameID Id of the game.
 * @returns The GameSettings object used to initialize the game instance.
 */
// eslint-disable-next-line arrow-body-style
const getGameSettings = (gameID: string): GameSetting => {
  return getGame(gameID).gameInstance.getGameSettings();
};

/**
 * Get a games state.
 *
 * @param gameID Id of the game.
 * @returns The current GameState.
 */
// eslint-disable-next-line arrow-body-style
const getGameState = (gameID: string): GameState => {
  return getGame(gameID).gameInstance.getGameState();
};

/**
 * Place a Users ships on the Game board.
 * Will throw a ValidationError if the placements are invalid.
 * Will throw an Error if the given User is not part of the Game, or
 * has already committed their placements.
 *
 * @param user The User placing the ships.
 * @param gameID Id of the game to place the ships in.
 * @param shipPlacements The ship placements.
 * @returns The state of the Game after the Users placements are made.
 */
const placeShips = (user: User, gameID: string, shipPlacements: ShipPlacement[]): GameState => {
  // get the game instance
  const game = getGame(gameID);

  // make sure the game isn't started already (or finished)
  if (game.gameInstance.getGameState() !== GameState.Created) {
    throw new Error('Game has already been initialized');
  }

  // validate the ship placements and throw an error if
  // any placement is invalid
  const placementErrors = game.gameInstance.verifyShipPlacements(shipPlacements);
  if (placementErrors.length !== 0) {
    throw new ValidationError({
      property: 'shipPlacements',
      errorKind: 'gameInput',
      value: JSON.stringify(shipPlacements),
      message: `Invalid ship placements: ${placementErrors.join('; ')}`,
    });
  }

  // apply the ship placements for the correct user,
  // or throw an error if user isn't part of the game
  if (user.id === game.userP1.id) {
    if (game.p1Placements) throw new Error('Player has already placed their ships');

    game.p1Placements = [...shipPlacements];
  } else if (user.id === game.userP2?.id) {
    if (game.p2Placements) throw new Error('Player has already placed their ships');

    game.p2Placements = [...shipPlacements];
  } else {
    throw new Error(`User '${user.username}' is not part of game id=${gameID}`);
  }

  // if both players have made heir placements, advance the game state
  if (game.p1Placements && game.p2Placements) {
    game.gameInstance.initialize(game.p1Placements, game.p2Placements);

    if (game.p1socket && game.p2socket && game.userP2) {
      game.gameInstance.start();

      const playsFirst = game.gameInstance.getCurrentPlayer() === Player.Player1
        ? game.userP1.username
        : game.userP2?.username;

      const gameStartedMessage: GameStartedMessage = {
        code: MessageCode.GameStarted,
        playsFirst,
      };

      const stringified = JSON.stringify(gameStartedMessage);
      game.p1socket.send(stringified);
      game.p2socket.send(stringified);
    }
  }

  return game.gameInstance.getGameState();
};

/**
 * Attempt to start the game.
 *
 * @param gameID The game to be started.
 * @returns Returns GameState.InProgress if the game is successfully started, or
 *          some other GameState if the game couldn't be started.
 */
const startGame = (gameID: string): GameState => {
  const game = getGame(gameID);

  try {
    game.gameInstance.start();
  } catch { /* empty */ }

  return game.gameInstance.getGameState();
};

/**
 * Perform a game move for the given player.
 *
 * @param gameID The Id of the game in which the move is being made.
 * @param username The username of the player making the move.
 * @param x x coordinate (column) of the cell being targeted.
 * @param y y coordinate (row) of the cell being targeted.
 * @returns A MoveResult indicating the result of hitting the specified cell.
 */
const makeMove = (gameID: string, username: string, x: number, y: number): MoveResult => {
  const game = getGame(gameID);

  let player: Player | null = null;
  if (username === game.userP1.username) player = Player.Player1;
  else if (username === game.userP2?.username) player = Player.Player2;

  if (!player) {
    throw new Error(`User '${username}' is not part of game id=${gameID}`);
  }

  return game.gameInstance.makeMove(player, x, y);
};

/**
 * Get the username of the player whoose turn it is to make a move.
 *
 * @param gameID The game Id.
 * @returns The username of the current player, or undefined if a player
 *          isn't connected yet.
 */
const getCurrentPlayer = (gameID: string): string | undefined => {
  const game = getGame(gameID);
  const currentPlayer = game.gameInstance.getCurrentPlayer();

  return currentPlayer === Player.Player1
    ? game.userP1.username
    : game.userP2?.username;
};

/**
 * Check if the opponent player has submitted their ship placements for
 * some game. Throws an Error if the given username isn't part of the
 * specified game.
 *
 * @param gameID The game's Id.
 * @param username The player's username.
 * @returns true if the opposing player has submitted valid ship placements
 */
const isOpponentReady = (gameID: string, username: string): boolean => {
  const game = getGame(gameID);

  if (game.userP1.username === username) {
    return game.p2Placements !== undefined;
  } if (game.userP2?.username === username) {
    return game.p1Placements !== undefined;
  }

  throw new Error(`User '${username}' isn't part of the game`);
};

/**
 * Call when a websocket upgrade has been requested. This method will check
 * that a websocket for a user/game combination hasn't already been opened,
 * and that a user is part of the game. Throws an Error if any condition
 * is not satisfied.
 *
 * @param username Username of the user requesting the websocket upgrade.
 * @param gameID Id of the Game for which a websocket connection is being opened.
 * @returns A reference to the opponents websocket connection to the same game instance, if any.
 */
const playerSocketRequested = (username: string, gameID: string): WebSocket<WSData> | null => {
  // try to find the game for the given gameId
  const game = getGame(gameID);

  if (game.userP1.username === username) {
    // make sure a ws connection isn't already open for the user
    if (game.p1socket) {
      throw new Error('Websocket for player/game combo already open');
    }

    // get a reference to the opponents websocket connetion (might still be null)
    return game.p2socket;
  }

  if (game.userP2?.username === username) {
    // make sure a ws connection isn't already open for the user
    if (game.p2socket) {
      throw new Error('Websocket for player/game combo already open');
    }

    // get a reference to the opponents websocket connetion (might still be null)
    return game.p1socket;
  }

  throw new Error(`Player '${username}' doesn't seem to be part of game id=${gameID}`);
};

/**
 * Call when a websocket access code message has been received and successfully decoded.
 * This method will check that a websocket connection isn't already opened for a User/Game
 * combination, also checks that the given user is part of the given game.
 * Throws an Error if any condition isn't satisfied.
 * If no errors are encountered, saved the given Websocket reference for the user/game
 * combination and returns a reference to the opponents Websocket, if one is registered
 * already.
 *
 * @param gameID Id of the Game for which a connection has been authenticated.
 * @param username Username of the User making the authentication.
 * @param socket The opened and authenticated websocket connection reference.
 * @returns The opponents websocket, if one is already opened and authenticated.
 */
const playerSocketAuthenticated = (
  gameID: string,
  username: string,
  socket: WebSocket<WSData>,
): WebSocket<WSData> | null => {
  const game = getGame(gameID);

  if (username === game.userP1.username) {
    if (game.p1socket) {
      throw new Error(`Connection already established for ${username} on game ${gameID}`);
    }

    game.p1socket = socket;
    return game.p2socket;
  }

  if (username === game.userP2?.username) {
    if (game.p2socket) {
      throw new Error(`Connection already established for ${username} on game ${gameID}`);
    }

    game.p2socket = socket;
    return game.p1socket;
  }

  throw new Error(`Game error - ${username} doesn't seem to be part of game ${gameID}`);
};

export default {
  createNewGame,
  joinWithInviteCode,
  gameExists,
  getGameSettings,
  getGameState,
  placeShips,
  startGame,
  makeMove,
  getCurrentPlayer,
  isOpponentReady,
  playerSocketRequested,
  playerSocketAuthenticated,
};
