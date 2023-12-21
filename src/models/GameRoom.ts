import { WebSocket } from 'uWebSockets.js';
import { GameSetting } from '../game/types';
import type { User } from './User';
import type { WSData } from './WSData';
import { ShipPlacement } from '../game/Ship';

export interface GameRoomStatus {
  player1: string;
  player2?: string;
  p1WSOpen: boolean;
  p2WSOpen: boolean;
  p1ShipsPlaced: boolean;
  p2ShipsPlaced: boolean;
  currentPlayer?: string;
}

interface GameRoom {
  readonly id: string;
  readonly gameSettings: GameSetting;
  readonly userP1: User;
  userP2?: User;
  p1Placements?: ShipPlacement[];
  p2Placements?: ShipPlacement[];
  p1socket?: WebSocket<WSData>;
  p2socket?: WebSocket<WSData>;
}

export default GameRoom;
