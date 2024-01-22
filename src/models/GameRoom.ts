import { WebSocket } from 'uWebSockets.js';
import { GameSetting } from '../game/GameSettings';
import type { User } from './User';
import type { WSData } from './WSData';
import { ShipPlacement } from '../game/Ship';
import Game from '../game/Game';

export interface GameRoomStatus {
  player1: string;
  player2?: string;
  p1WSOpen: boolean;
  p2WSOpen: boolean;
  p1ShipsPlaced: boolean;
  p2ShipsPlaced: boolean;
  currentPlayer?: string;
}

export interface GameRoom {
  readonly id: string;
  readonly gameSettings: GameSetting;
  readonly userP1: User;
  userP2?: User;
  p1Placements?: ShipPlacement[];
  p2Placements?: ShipPlacement[];
  p1socket?: WebSocket<WSData>;
  p2socket?: WebSocket<WSData>;
}

export interface ActiveGameRoom {
  readonly id: string;
  readonly gameSettings: GameSetting;
  readonly userP1: User;
  readonly userP2: User;
  readonly p1Placements: ShipPlacement[];
  readonly p2Placements: ShipPlacement[];
  readonly p1socket: WebSocket<WSData>;
  readonly p2socket: WebSocket<WSData>;
  gameInstance: Game;
}

/**
 * Checks whether a game room has all of its missing components
 * initialized (an opponent player, both of the players ship
 * placements and websocket connections).
 *
 * @param room The GameRoom to be checked
 * @returns true if the given GameRoom has all of its components initialized and can
 *          be cast to an ActiveGameRoom object.
 */
export const gameRoomIsActive = (room: GameRoom): room is ActiveGameRoom => (
  room.userP2 !== undefined
  && room.p1Placements !== undefined
  && room.p2Placements !== undefined
  && room.p1socket !== undefined
  && room.p2socket !== undefined
);

export const gameStatusIsActive = (roomStatus: GameRoomStatus): boolean => (
  roomStatus.player2 !== undefined
  && roomStatus.currentPlayer !== undefined
  && roomStatus.p1ShipsPlaced
  && roomStatus.p1WSOpen
  && roomStatus.p2ShipsPlaced
  && roomStatus.p2WSOpen
);
