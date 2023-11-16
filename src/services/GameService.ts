import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import Game, { GameState } from '../game/Game';
import { Player, ShipPlacement } from '../game/types';
import { DefaultSettings } from '../game/Board';
import type { WSAuthTicket } from '../models/WSAuthTicket';
import type ActiveGame from '../models/ActiveGame';
import type { GameCreatedResult } from '../graphql/types/GameCreatedResult';
import EntityNotFoundError from './errors/EntityNotFoundError';
import { User } from '../models/User';
import ValidationError from './errors/ValidationError';
import { GameJoinedResult } from '../graphql/types/GameJoinedResult';

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

const getGameInternal = (id: string): ActiveGame => {
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

// const verifyWSAuthCode = (code: string): WSAuthTicket | false => {
//   try {
//     const payload = jwt.verify(code, config.JWT_SECRET);
//     if (typeof payload === 'object'
//       && 'username' in payload
//       && 'gameId' in payload) {
//       return {
//         username: payload.username,
//         gameId: payload.gameId,
//       };
//     }

//     return false;
//   } catch {
//     return false;
//   }
// };

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
    userOwner: user,
    userP2: null,
    gameInstance,
    ownerPlacements: null,
    p2Placements: null,
  };

  activeGames.set(id, game);

  const wsAuthCode = createWSAuthCode({ username: user.username, gameId: id });

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
  const game = getGameInternal(gameId);

  // check that the game hasn't advanced past the Created state
  if (game.gameInstance.getGameState() !== GameState.Created) {
    throw new Error('Cannot join a game which is not in the Created state');
  }

  // check that a second player hasn't joined already
  if (game.userP2) {
    throw new Error('Cannot join game - a pleyer already joine');
  }

  // 'join' the player to the game
  game.userP2 = user;

  const wsAuthCode = createWSAuthCode({ username: user.username, gameId: game.id });

  return {
    gameId: game.id,
    wsAuthCode,
  };
};

const placeShips = (user: User, gameId: string, shipPlacements: ShipPlacement[]): GameState => {
  const game = getGameInternal(gameId);

  if (game.gameInstance.getGameState() !== GameState.Created) {
    throw new Error('Game has already been initialized');
  }

  const placementErrors = game.gameInstance.verifyShipPlacements(shipPlacements);
  if (placementErrors.length !== 0) {
    throw new ValidationError(`Invalid ship placements:\n${placementErrors}`);
  }

  if (user.id === game.userOwner.id) {
    if (game.ownerPlacements) throw new Error('Player has already placed their ships');

    game.ownerPlacements = [...shipPlacements];
  } else if (user.id === game.userP2?.id) {
    if (game.p2Placements) throw new Error('Player has already placed their ships');

    game.p2Placements = [...shipPlacements];
  } else {
    throw new Error(`User '${user.username}' is not part of game id=${gameId}`);
  }

  if (game.ownerPlacements && game.p2Placements) {
    game.gameInstance.initialize(game.ownerPlacements, game.p2Placements);
  }

  return game.gameInstance.getGameState();
};

const getGame = (gameId: string): Game => getGameInternal(gameId).gameInstance;

export default {
  createNewGame,
  joinWithInviteCode,
  gameExists,
  getGame,
  placeShips,
};
