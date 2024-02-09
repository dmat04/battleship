import { randomUUID } from 'crypto';
import { WebSocket } from 'uWebSockets.js';
import AuthService from './AuthService';
import DefaultSettings from '../game/DefaultSettings';
import ValidationError from './errors/ValidationError';
import EntityNotFoundError from './errors/EntityNotFoundError';
import type {
  ActiveGameRoom,
  ActivePlayerData,
  GameRoom,
  PlayerData,
} from '../models/GameRoom';
import type { User } from '../models/User';
import { WSData } from '../models/WSData';
import Board, { CellHitResult } from '../game/Board';
import { getPlayerData, gameRoomIsActive, getActivePlayerData } from '../models/GameRoom';
import {
  ClientMessage,
  ClientMessageCode,
  ErrorMessage,
  GameStartedMessage,
  OpponentMoveResultMessage,
  OwnMoveResultMessage,
  RoomStatusResponseMessage,
  ServerMessageCode,
  ShootMessage,
} from '../ws/MessageTypes';
import {
  GameRoomStatus,
  GameSettings,
  RoomCreatedResult,
  RoomJoinedResult,
  ShipPlacementInput,
  ShipsPlacedResult,
} from '../graphql/types.generated';
import { assertNever } from '../utils/typeUtils';
import Game, { GameState } from '../game/Game';
import GameplayError from '../game/GameplayError';

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
 * @returns The GameRoom reference, or undefined if no room is
 *          found for the given Id.
 */
const getRoom = (id: string): GameRoom | undefined => gameRooms.get(id);

/**
 * Remove a game room from the registry of rooms.
 *
 * @param id ID of the game room to be removed.
 * @returns true if the specified game room was removed, false otherwise.
 */
// const removeRoom = (id: string): boolean => gameRooms.delete(id);

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

  const player1: PlayerData = {
    user,
  };

  // Set the owner user to the passed-in user entity,
  // userP2, ship placements and websocket instances remain
  // undefined for starters.
  const room: GameRoom = {
    id,
    player1,
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

const getRoomStatusInternal = (room: GameRoom, player: string): GameRoomStatus => {
  const { playerData, opponentData } = getPlayerData(room, player);

  return {
    player: playerData?.user.username ?? '',
    playerShipsPlaced: playerData?.shipPlacements !== undefined,
    playerSocketConnected: playerData?.socket !== undefined,
    opponent: opponentData?.user.username,
    opponentShipsPlaced: opponentData?.shipPlacements !== undefined,
    opponentSocketConnected: opponentData?.socket !== undefined,
    currentPlayer: room.gameInstance?.getCurrentPlayer(),
  };
};

const sendMoveResultResponse = (
  currentPlayer: string,
  moveResult: CellHitResult,
  player: ActivePlayerData,
  opponent: ActivePlayerData,
) => {
  const ownResponse: OwnMoveResultMessage = {
    ...moveResult,
    code: ServerMessageCode.OwnMoveResult,
    currentPlayer,
  };

  const opponentResponse: OpponentMoveResultMessage = {
    ...moveResult,
    code: ServerMessageCode.OpponentMoveResult,
    currentPlayer,
  };

  player.socket.send(JSON.stringify(ownResponse));
  opponent.socket.send(JSON.stringify(opponentResponse));
};

const turnTimeExpired = (room: ActiveGameRoom) => {
  const {
    turnTimer,
    gameInstance,
  } = room;

  let currentPlayer = gameInstance.getCurrentPlayer();
  const { playerData, opponentData } = getActivePlayerData(room, currentPlayer);

  try {
    const moveResult = gameInstance.makeRandomMove(currentPlayer);
    currentPlayer = gameInstance.getCurrentPlayer();

    sendMoveResultResponse(currentPlayer, moveResult, playerData, opponentData);
    turnTimer.refresh();
  } catch (error) {
    if (error instanceof GameplayError) {
      // TODO: handle case when random move couldn't be made
    }
  }
};

const attemptToStartGame = (room: GameRoom) => {
  if (!gameRoomIsActive(room)) return;

  const { gameInstance } = room;

  if (gameInstance.getGameState() !== GameState.Created) return;

  gameInstance.initialize(
    room.player1.shipPlacements,
    room.player2.shipPlacements,
  );

  gameInstance.start();

  const message: GameStartedMessage = {
    code: ServerMessageCode.GameStarted,
    playsFirst: gameInstance.getCurrentPlayer(),
  };

  const encoded = JSON.stringify(message);
  room.player1.socket.send(encoded);
  room.player2.socket.send(encoded);

  // eslint-disable-next-line no-param-reassign
  room.turnTimer = setTimeout(
    () => turnTimeExpired(room),
    room.gameSettings.turnDuration * 1000,
  );
};

const roomStatusUpdated = (room: GameRoom) => {
  if (room.player1.socket) {
    const message: RoomStatusResponseMessage = {
      code: ServerMessageCode.RoomStatusResponse,
      roomStatus: getRoomStatusInternal(room, room.player1.user.username),
    };

    room.player1.socket.send(JSON.stringify(message));
  }

  if (room?.player2 && room.player2.socket) {
    const message: RoomStatusResponseMessage = {
      code: ServerMessageCode.RoomStatusResponse,
      roomStatus: getRoomStatusInternal(room, room.player2.user.username),
    };

    room.player2.socket.send(JSON.stringify(message));
  }

  attemptToStartGame(room);
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

  // find the game instance for the retrieved game id
  const gameRoom = getRoom(roomID);
  if (!gameRoom) {
    throw new Error('Cannot join room - room not found');
  }

  // make sure that the user who created the game doesn't join as player 2
  if (gameRoom.player1.user.id === user.id) {
    throw new Error('Cannot join room - you have already joined this room');
  }

  // check that a second player hasn't joined already
  if (gameRoom.player2) {
    throw new Error('Cannot join room - a player already joined');
  }

  // delete the invite code
  inviteCodes.delete(inviteCode);

  // 'join' the player to the game
  gameRoom.player2 = {
    user,
  };

  gameRoom.gameInstance = new Game(
    gameRoom.player1.user.username,
    gameRoom.player2.user.username,
    gameRoom.gameSettings,
  );

  const wsAuthCode = AuthService.encodeWSToken({ username: user.username, roomID: gameRoom.id });

  roomStatusUpdated(gameRoom);

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
const getGameSettings = (roomID: string): GameSettings => {
  const room = getRoom(roomID);

  if (!room) {
    throw new Error('Cannot get game settings - room not found');
  }

  return room.gameSettings;
};

/**
 * Get the game rooms status.
 *
 * @param roomID Id of the game room.
 * @returns The status of the specified game room.
 */
const getRoomStatus = (roomID: string, player: string): GameRoomStatus => {
  const room = getRoom(roomID);

  if (!room) {
    throw new Error('Game room not found');
  }

  return getRoomStatusInternal(room, player);
};

/**
 * Place a Users ships on the Game board.
 * Will throw a ValidationError if the placements are invalid.
 * Will throw an Error if the given User is not part of the Game, or
 * has already committed their placements.
 *
 * @param user The User placing the ships.
 * @param roomID Id of the game to place the ships in.
 * @param shipPlacements The ship placements.
 * @returns The state of the game room after the Users placements are made.
 */
const placeShips = (
  user: User,
  roomID: string,
  shipPlacements: ShipPlacementInput[],
): ShipsPlacedResult => {
  // get the game instance
  const room = getRoom(roomID);

  if (!room) {
    throw new Error('Cannot submit ship placements - game room not found');
  }

  // validate the ship placements and throw an error if
  // any placement is invalid
  const { errors, placedShips } = Board.verifyShipPlacements(shipPlacements, room.gameSettings);
  if (errors || !placedShips) {
    throw new ValidationError({
      property: 'shipPlacements',
      errorKind: 'gameInput',
      value: JSON.stringify(shipPlacements),
      message: `Invalid ship placements: ${errors?.join('; ')}`,
    });
  }

  // Select the correct player data
  const { playerData } = getPlayerData(room, user.username);

  // Throw an error if no playerData instance is selected
  if (!playerData) {
    throw new Error(`User '${user.username}' is not part of game room id=${roomID}`);
  }

  // Throw an error if the user has already submitted ship placements
  if (playerData.shipPlacements) {
    throw new Error('Player has already placed their ships');
  }

  // Assign the ship placements
  playerData.shipPlacements = [...shipPlacements];
  roomStatusUpdated(room);

  return {
    placedShips,
    gameRoomStatus: getRoomStatusInternal(room, user.username),
  };
};

/**
 * Call when a websocket upgrade has been requested. This method will check
 * that a websocket for a user/game combination hasn't already been opened,
 * and that a user is part of the game. Throws an Error if any condition
 * is not satisfied.
 *
 * @param username Username of the user requesting the websocket upgrade.
 * @param gameID Id of the Game for which a websocket connection is being opened.
 */
const clientSocketRequested = (username: string, gameID: string): void => {
  // try to find the game for the given gameId
  const room = getRoom(gameID);

  if (!room) {
    throw new Error('Game room not found');
  }

  // Select the correct player data
  const { playerData } = getPlayerData(room, username);

  // Throw an error if no playerData instance is selected
  if (!playerData) {
    throw new Error(`User '${username}' is not part of game room id=${gameID}`);
  }

  // Throw an error if the user has already opened a websocket connection
  if (playerData.socket) {
    throw new Error('Player has already opened websocket');
  }
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
 * @returns Returns the current status of the GameRoom
 */
const clientSocketAuthenticated = (
  roomID: string,
  username: string,
  socket: WebSocket<WSData>,
) => {
  const room = getRoom(roomID);

  if (!room) {
    throw new Error('Game room not found');
  }

  // Select the correct player data
  const { playerData } = getPlayerData(room, username);

  if (!playerData) {
    throw new Error(`Game error - ${username} doesn't seem to be part of game ${roomID}`);
  }

  if (playerData.socket) {
    throw new Error(`Connection already established for ${username} on game ${roomID}`);
  }

  const responseMessage = {
    code: ServerMessageCode.AuthenticatedResponse,
  };

  // send a confirmation message
  socket.send(JSON.stringify(responseMessage));

  playerData.socket = socket;

  roomStatusUpdated(room);
};

/**
 * Call when an opened and authenticated socket has been closed.
 * This method will mark the players socket as undefined for the given room.
 * Throws an Error if a game with the specified ID isn't found, or the given
 * username isn't part of the specified game room.
 *
 * @param roomID Id of the room for in which a players socket was closed
 * @param username Username of the payer whoose socket was closed
 */
const clientSocketClosed = (roomID: string, username: string): void => {
  const room = getRoom(roomID);

  if (!room) {
    throw new Error('Game room not found');
  }

  const { playerData } = getPlayerData(room, username);

  if (!playerData) {
    throw new Error(`Game error - ${username} doesn't seem to be part of game ${roomID}`);
  }

  playerData.socket = undefined;
};

const handleShootMessage = (room: GameRoom, player: string, message: ShootMessage) => {
  const { playerData: maybePlayerData } = getPlayerData(room, player);

  if (!gameRoomIsActive(room)) {
    const response: ErrorMessage = {
      code: ServerMessageCode.Error,
      message: 'Can\'t make move, game is not active.',
    };

    maybePlayerData?.socket?.send(JSON.stringify(response));
    return;
  }

  const { playerData, opponentData } = getActivePlayerData(room, player);

  try {
    const { x, y } = message;
    const result = room.gameInstance.makeMove(playerData.user.username, x, y);
    const currentPlayer = room.gameInstance.getCurrentPlayer();

    sendMoveResultResponse(
      currentPlayer,
      result,
      playerData,
      opponentData,
    );

    room.turnTimer.refresh();
  } catch (error) {
    let errorMessage = 'An unknown error has occured';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'An unknown error has occured';
    }

    const response: ErrorMessage = {
      code: ServerMessageCode.Error,
      message: errorMessage,
    };

    playerData.socket.send(JSON.stringify(response));
  }
};

const handleRoomStatusRequestMessage = (room: GameRoom, player: string) => {
  const { playerData } = getPlayerData(room, player);

  const roomStatus = getRoomStatusInternal(room, player);

  if (roomStatus && playerData?.socket) {
    const response: RoomStatusResponseMessage = {
      code: ServerMessageCode.RoomStatusResponse,
      roomStatus,
    };

    playerData.socket.send(JSON.stringify(response));
  }
};

const handleClientMessage = (roomID: string, player: string, message: ClientMessage) => {
  const room = getRoom(roomID);

  if (!room) {
    throw new Error('Game room not found');
  }

  const { code } = message;

  switch (code) {
    case ClientMessageCode.Shoot:
      handleShootMessage(room, player, message);
      break;
    case ClientMessageCode.RoomStatusRequest:
      handleRoomStatusRequestMessage(room, player);
      break;
    default: assertNever(code);
  }
};

export default {
  createNewRoom,
  joinWithInviteCode,
  roomExists,
  getGameSettings,
  getRoomStatus,
  placeShips,
  clientSocketRequested,
  clientSocketAuthenticated,
  clientSocketClosed,
  handleClientMessage,
};
