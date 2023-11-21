import { randomUUID } from 'crypto';
import { WebSocket } from 'uWebSockets.js';
import AuthService from './AuthService';
import Game, { GameState } from '../game/Game';
import { GameSetting, Player, ShipPlacement } from '../game/types';
import { DefaultSettings } from '../game/Board';
import ValidationError from './errors/ValidationError';
import EntityNotFoundError from './errors/EntityNotFoundError';
import type ActiveGame from '../models/ActiveGame';
import type { GameCreatedResult } from '../graphql/types/GameCreatedResult';
import type { User } from '../models/User';
import type { GameJoinedResult } from '../graphql/types/GameJoinedResult';
import { WSData } from '../models/WSData';

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

// eslint-disable-next-line arrow-body-style
const getGameSettings = (gameID: string): GameSetting => {
  return getGame(gameID).gameInstance.getGameSettings();
};

const placeShips = (user: User, gameID: string, shipPlacements: ShipPlacement[]): GameState => {
  const game = getGame(gameID);

  if (game.gameInstance.getGameState() !== GameState.Created) {
    throw new Error('Game has already been initialized');
  }

  const placementErrors = game.gameInstance.verifyShipPlacements(shipPlacements);
  if (placementErrors.length !== 0) {
    throw new ValidationError({
      property: 'shipPlacements',
      errorKind: 'gameInput',
      value: JSON.stringify(shipPlacements),
      message: `Invalid ship placements: ${placementErrors.join('; ')}`,
    });
  }

  if (user.id === game.userP1.id) {
    if (game.p1Placements) throw new Error('Player has already placed their ships');

    game.p1Placements = [...shipPlacements];
  } else if (user.id === game.userP2?.id) {
    if (game.p2Placements) throw new Error('Player has already placed their ships');

    game.p2Placements = [...shipPlacements];
  } else {
    throw new Error(`User '${user.username}' is not part of game id=${gameID}`);
  }

  if (game.p1Placements && game.p2Placements) {
    game.gameInstance.initialize(game.p1Placements, game.p2Placements);
    // wsApp.publish(game.id, 'GAME INITIALIZED');
  }

  return game.gameInstance.getGameState();
};

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

const playerSocketAuthenticated = (
  gameID: string,
  username: string,
  socket: WebSocket<WSData>,
): WebSocket<WSData> | null => {
  const game = getGame(gameID);

  if (username === game.userP1.username) {
    game.p1socket = socket;
    return game.p2socket;
  }

  if (username === game.userP2?.username) {
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
  placeShips,
  playerSocketRequested,
  playerSocketAuthenticated,
};
