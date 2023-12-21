import { randomUUID } from 'crypto';
import { WebSocket } from 'uWebSockets.js';
import AuthService from './AuthService';
import { GameState } from '../game/Game';
import {
  GameSetting, DefaultSettings,
} from '../game/types';
import ValidationError from './errors/ValidationError';
import EntityNotFoundError from './errors/EntityNotFoundError';
import type GameRoom from '../models/GameRoom';
import type { RoomCreatedResult } from '../graphql/types/RoomCreatedResult';
import type { User } from '../models/User';
import type { RoomJoinedResult } from '../graphql/types/RoomJoinedResult';
import { WSData } from '../models/WSData';
import ActiveGameService from './ActiveGameService';
import Board from '../game/Board';
import { ShipPlacement } from '../game/Ship';

/**
 * Registry of open game rooms, indexed by game Id's
 */
const gameRooms: Map<string, GameRoom> = new Map<string, GameRoom>();

/**
 * Registry of game invite codes, each key is an invite code, and is mapped to a
 * corresponding game id
 */
const inviteCodes: Map<string, string> = new Map<string, string>();

/**
 * Check if a game room exists.
 *
 * @param id Id of the room to check.
 * @returns true if a game room with the given Id exists, false otherwise
 */
const roomExists = (id: string): boolean => gameRooms.has(id);

/**
 * Get a reference to a GameRoom for a given room ID.
 *
 * @param id Id of the game room to find.
 * @returns The GameRoom reference, or throws an EntityNotFoundError if no room is
 *          found for the given Id.
 */
const getRoom = (id: string): GameRoom => {
  const room = gameRooms.get(id);
  if (!room) {
    throw new EntityNotFoundError('GameRoom', id);
  }

  return room;
};

/**
 * Remove a game room from the registry of rooms.
 *
 * @param id ID of the game room to be removed.
 * @returns The removed GameRoom instance.
 */
const removeRoom = (id: string): GameRoom => {
  const room = getRoom(id);
  gameRooms.delete(id);
  return room;
};

/**
 * Generate a new unique room id.
 *
 * @returns A string representing a unique room id.
 */
const generateRoomID = (): string => {
  let id = randomUUID();

  while (roomExists(id)) {
    id = randomUUID();
  }

  return id;
};

/**
 * Checks whether a game room has all of it's missing components
 * initialized (an opponent player, both of the players ship
 * placements and websocket connections). If all of the components
 * are initilized, the rooms game instance can be started, and the
 * room transferred to the ActiveGameService.
 *
 * @param roomID ID of the game room to be checked.
 * @returns true if the rooms game instance can be started, false otherwise.
 */
const isRoomReadyToStart = (room: GameRoom): boolean => room.userP2 !== undefined
  && room.p1Placements !== undefined
  && room.p2Placements !== undefined
  && room.p1socket !== undefined
  && room.p2socket !== undefined;

/**
 * Remove a game room from this services room registry,
 * and pass its ownership to the ActiveGameService.
 *
 * @param roomID ID of the game room to be transferred.
 */
const transferRoomToActiveGames = (roomID: string): void => {
  const room = removeRoom(roomID);
  ActiveGameService.addGameRoom(room);
};

/**
 * Create a game room invite code. This method will create a unique, pseudo-random,
 * 'human-readable' six-digit invite code and associate the provided room Id with it.
 *
 * @param roomID Id of the game room for which the invite code is to be generated.
 * @returns The generated invite code.
 */
const createInviteCode = (roomID: string): string => {
  // generate a random number between 100_000 and 999_999 ...
  let number = (100_000 + Math.random() * 900_000);
  // round it, and convert to string
  let code = Math.floor(number).toString();

  while (inviteCodes.has(code)) {
    // repeat the process if the geenrated code happens to already exist
    number = (100_000 + Math.random() * 900_000);
    code = Math.floor(number).toString();
  }

  // save the code and associate the room id to it
  inviteCodes.set(code, roomID);

  return code;
};

/**
 * Create a new game room.
 *
 * @param user The User creating the room - will be considered the created game rooms 'owner'.
 * @returns A RoomCreatedResult which includes the newly created rooms ID, an invite
 *          code to invite another user to the created room, and a wsAuthCode to initiate
 *          a websocket connection.
 */
const createNewRoom = (user: User): RoomCreatedResult => {
  const id = generateRoomID();
  const inviteCode = createInviteCode(id);

  // Set the owner user to the passed-in user entity,
  // userP2, ship placements and websocket instances remain
  // undefined for starters.
  const room: GameRoom = {
    id,
    userP1: user,
    gameSettings: DefaultSettings,
  };

  gameRooms.set(id, room);

  const wsAuthCode = AuthService.encodeWSToken({ username: user.username, roomID: id });

  return {
    roomID: id,
    inviteCode,
    wsAuthCode,
  };
};

/**
 * Lets a User join an existing room using an invite code.
 * Throws an error if the invite code is invalid, or someone else
 * already joined the room.
 *
 * @param inviteCode The invite code.
 * @param user The user attempting to join the room.
 * @returns A GameJoinedResult which includes the games Id and a wsAuthCode which can be used
 *          to initiate a websocket connection
 */
const joinWithInviteCode = (inviteCode: string, user: User): RoomJoinedResult => {
  // find the corresponding game id for the invite code
  const roomID = inviteCodes.get(inviteCode);
  if (!roomID) {
    throw new EntityNotFoundError('GameRoom', inviteCode);
  }

  // delete the invite code
  inviteCodes.delete(inviteCode);

  // find the game instance for the retrieved game id
  const gameRoom = getRoom(roomID);

  // make sure that the user who created the game doesn't join as player 2
  if (gameRoom.userP1.id === user.id) {
    throw new Error('Cannot join room - you have already joined this room');
  }

  // check that a second player hasn't joined already
  if (gameRoom.userP2) {
    throw new Error('Cannot join room - a player already joined');
  }

  // 'join' the player to the game
  gameRoom.userP2 = user;

  const wsAuthCode = AuthService.encodeWSToken({ username: user.username, roomID: gameRoom.id });

  return {
    roomID: gameRoom.id,
    wsAuthCode,
  };
};

/**
 * Get the GameSettings for a GameRoom instance.
 *
 * @param roomID Id of the game room.
 * @returns The GameSettings object used to initialize the game instance.
 */
// eslint-disable-next-line arrow-body-style
const getGameSettings = (roomID: string): GameSetting => {
  return getRoom(roomID).gameSettings;
};

/**
 * Get a GameRooms game instance state.
 *
 * @param roomID Id of the game room.
 * @returns The current GameState.
 */
// eslint-disable-next-line arrow-body-style
// const getGameState = (roomID: string): GameState => {
//   return getRoom(roomID).gameInstance.getGameState();
// };

// TODO: Create a GameRoomState type to replace GameState
/**
 * Place a Users ships on the Game board.
 * Will throw a ValidationError if the placements are invalid.
 * Will throw an Error if the given User is not part of the Game, or
 * has already committed their placements.
 *
 * @param user The User placing the ships.
 * @param roomID Id of the game to place the ships in.
 * @param shipPlacements The ship placements.
 * @returns The state of the Game after the Users placements are made.
 */
const placeShips = (user: User, roomID: string, shipPlacements: ShipPlacement[]): GameState => {
  // get the game instance
  const room = getRoom(roomID);

  // validate the ship placements and throw an error if
  // any placement is invalid
  const placementErrors = Board.verifyShipPlacements(shipPlacements, room.gameSettings);
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
  if (user.id === room.userP1.id) {
    if (room.p1Placements) throw new Error('Player has already placed their ships');

    room.p1Placements = [...shipPlacements];
  } else if (user.id === room.userP2?.id) {
    if (room.p2Placements) throw new Error('Player has already placed their ships');

    room.p2Placements = [...shipPlacements];
  } else {
    throw new Error(`User '${user.username}' is not part of game room id=${roomID}`);
  }

  if (isRoomReadyToStart(room)) {
    transferRoomToActiveGames(roomID);
  }

  return GameState.Created;
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
  const game = getRoom(gameID);

  if (game.userP1.username === username) {
    // make sure a ws connection isn't already open for the user
    if (game.p1socket) {
      throw new Error('Websocket for player/game combo already open');
    }

    // get a reference to the opponents websocket connetion (might still be null)
    return game.p2socket ?? null;
  }

  if (game.userP2?.username === username) {
    // make sure a ws connection isn't already open for the user
    if (game.p2socket) {
      throw new Error('Websocket for player/game combo already open');
    }

    // get a reference to the opponents websocket connetion (might still be null)
    return game.p1socket ?? null;
  }

  throw new Error(`Player '${username}' doesn't seem to be part of game id=${gameID}`);
};

/**
 * Call when a websocket access code message has been received and successfully decoded.
 * This method will check that a websocket connection isn't already opened for a User/Room
 * combination, also checks that the given user is part of the given game room.
 * Throws an Error if any condition isn't satisfied.
 * If no errors are encountered, saves the given Websocket reference for the user/room.
 *
 * @param roomID Id of the GameRoom for which a connection has been authenticated.
 * @param username Username of the User making the authentication.
 * @param socket Reference to the opened and authenticated websocket connection.
 */
const playerSocketAuthenticated = (
  roomID: string,
  username: string,
  socket: WebSocket<WSData>,
): void => {
  const room = getRoom(roomID);

  if (username === room.userP1.username) {
    if (room.p1socket) {
      throw new Error(`Connection already established for ${username} on game ${roomID}`);
    }

    room.p1socket = socket;
    if (isRoomReadyToStart(room)) {
      transferRoomToActiveGames(roomID);
    }

    return;
  }

  if (username === room.userP2?.username) {
    if (room.p2socket) {
      throw new Error(`Connection already established for ${username} on game ${roomID}`);
    }

    room.p2socket = socket;
    if (isRoomReadyToStart(room)) {
      transferRoomToActiveGames(roomID);
    }

    return;
  }

  throw new Error(`Game error - ${username} doesn't seem to be part of game ${roomID}`);
};

export default {
  createNewRoom,
  joinWithInviteCode,
  roomExists,
  getGameSettings,
  placeShips,
  playerSocketRequested,
  playerSocketAuthenticated,
};
