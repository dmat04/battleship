import { GameRoomStatus, ShipPlacement } from '../../__generated__/graphql';
import { ServerMessage } from './messageTypes';

export interface SliceState {
  gameRoomStatus: GameRoomStatus;
  playerShips: ShipPlacement[];
  playerGrid: CellState[][];
  opponentGrid: CellState[][];
  sunkenPayerShips: ShipPlacement[];
  sunkenOpponentShips: ShipPlacement[];
  messageQueue: ServerMessage[];
  pendingMessage: ServerMessage | null;
}

export enum CellState {
  Empty = 'Empty',
  Miss = 'Miss',
  Hit = 'Hit',
}
