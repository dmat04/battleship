import { WebSocket } from 'uWebSockets.js';
import { GameSetting } from '../game/types';
import type { User } from './User';
import type { WSData } from './WSData';
import { ShipPlacement } from '../game/Ship';

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
