import { randomUUID } from 'crypto';

import Game, { GameState } from '../game/Game';
import { Player } from '../game/types';
import { DefaultSettings } from '../game/Board';
import type ActiveGame from '../models/ActiveGame';
import type { GameCreatedResult } from '../graphql/types/GameCreatedResult';
import EntityNotFoundError from './errors/EntityNotFoundError';
import { User } from '../models/User';

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
 * Generate a new unique game id.
 *
 * @returns A string representing a unique game id.
 */
const generateGameId = (): string => {
  let id = randomUUID();

  while (activeGames.has(id)) {
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

/**
 * Create a new game.
 *
 * @param user The User creating the game - will be considered the created games 'owner'
 * @returns A GameCreatedResult which includes the newly created games Id, and an invite
 *          code to invite another user to the created Game
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
  };

  activeGames.set(id, game);

  return {
    gameId: id,
    inviteCode,
  };
};

/**
 * Let's a User join an existing Game using an invite code.
 * Throws an error if the invite code is invalid, or someone else
 * already joined the game.
 *
 * @param inviteCode The invite code
 * @param user The user attempting to join the game
 * @returns The game id if the user is successfully joined
 */
const joinWithInviteCode = (inviteCode: string, user: User): string => {
  // find the corresponding game id for the invite code
  const gameId = inviteCodes.get(inviteCode);
  if (!gameId) {
    throw new EntityNotFoundError('Game', inviteCode);
  }

  // delete the invite code
  inviteCodes.delete(inviteCode);

  // find the game instance for the retrieved game id
  const game = activeGames.get(gameId);
  if (!game) {
    throw new EntityNotFoundError('Game', gameId);
  }

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

  return game.id;
};

const gameExists = (id: string): boolean => activeGames.has(id);

const getGame = (id: string): Game | undefined => activeGames.get(id)?.gameInstance;

export default {
  createNewGame,
  joinWithInviteCode,
  gameExists,
  getGame,
};
