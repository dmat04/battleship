import { WebSocket } from 'uWebSockets.js';
import Game, { GameState } from '../game/Game';
import {
  GameRoom,
  ActiveGameRoom,
  GameRoomStatus,
  gameRoomIsActive,
} from '../models/GameRoom';
import EntityNotFoundError from './errors/EntityNotFoundError';
import { WSData } from '../models/WSData';
import { MoveResult } from '../game/Board';
import { GameStartedMessage, ServerMessageCode } from '../ws/MessageTypes';

/**
 * Registry of active game instances, indexed by game Id's
 */
const activeRooms: Map<string, ActiveGameRoom> = new Map<string, ActiveGameRoom>();

/**
 * Get a reference to a GameRoom for a given room ID.
 *
 * @param id Id of the game room to find.
 * @returns The GameRoom reference, or throws an EntityNotFoundError if no room is
 *          found for the given Id.
 */
const getRoom = (id: string): ActiveGameRoom => {
  const room = activeRooms.get(id);
  if (!room) {
    throw new EntityNotFoundError('GameRoom', id);
  }

  return room;
};

/**
 * Get the game rooms status.
 *
 * @param roomID Id of the game room.
 * @returns The status of the specified game room.
 */
const getRoomStatus = (roomID: string): GameRoomStatus => {
  const room = getRoom(roomID);
  return {
    player1: room.userP1.username,
    player2: room.userP2?.username,
    p1WSOpen: room.p1socket !== undefined,
    p2WSOpen: room.p2socket !== undefined,
    p1ShipsPlaced: room.p1Placements !== undefined,
    p2ShipsPlaced: room.p2Placements !== undefined,
    currentPlayer: room.userP1.username,
  };
};

const addGameRoom = (room: GameRoom): GameRoomStatus => {
  if (!gameRoomIsActive(room)) {
    throw new Error('GameRoom has missing members, cannot add it to active game rooms');
  }

  const gameInstance = new Game(room.userP1.username, room.userP2.username, room.gameSettings);
  gameInstance.initialize(room.p1Placements, room.p2Placements);

  const activeRoom: ActiveGameRoom = { ...room, gameInstance };

  const p1WSData = activeRoom.p1socket.getUserData();
  const p2WSData = activeRoom.p2socket.getUserData();
  p1WSData.roomIsActive = true;
  p2WSData.roomIsActive = true;

  activeRooms.set(activeRoom.id, activeRoom);
  return getRoomStatus(room.id);
};

const startGame = (roomID: string): boolean => {
  try {
    const { gameInstance, p1socket, p2socket } = getRoom(roomID);
    if (gameInstance.getGameState() !== GameState.Initialized) return false;

    gameInstance.start();

    const startGameMessage: GameStartedMessage = {
      code: ServerMessageCode.GameStarted,
      playsFirst: gameInstance.getCurrentPlayer(),
    };

    const serialized = JSON.stringify(startGameMessage);
    p1socket.send(serialized);
    p2socket.send(serialized);
    return true;
  } catch {
    return false;
  }
};

const makeMove = (
  roomID: string,
  username: string,
  x: number,
  y: number,
): { result: MoveResult, currentPlayer: string, opponentWS: WebSocket<WSData> } => {
  const room = getRoom(roomID);

  const result = room.gameInstance.makeMove(username, x, y);
  const currentPlayer = room.gameInstance.getCurrentPlayer();

  return {
    result,
    currentPlayer,
    opponentWS: username === room.userP1.username ? room.p2socket : room.p1socket,
  };
};

export default {
  addGameRoom,
  startGame,
  getRoomStatus,
  makeMove,
};
