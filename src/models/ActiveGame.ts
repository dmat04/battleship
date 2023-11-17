import { WebSocket } from 'uWebSockets.js';
import Game from '../game/Game';
import { ShipPlacement } from '../game/types';
import type { User } from './User';
import type { WSData } from './WSData';

interface ActiveGame {
  readonly id: string;
  readonly gameInstance: Game;
  readonly userP1: User;
  userP2?: User;
  p1Placements?: ShipPlacement[];
  p2Placements?: ShipPlacement[];
  p1socket?: WebSocket<WSData>;
  p2socket?: WebSocket<WSData>;
}

export default ActiveGame;
