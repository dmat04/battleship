import { GameRoomStatus, ShipPlacement } from '../../__generated__/graphql';

export interface SliceState {
  gameRoomStatus: GameRoomStatus;
  playerShips: ShipPlacement[];
  playerGrid: CellState[][];
  opponentGrid: CellState[][];
  sunkenPayerShips: ShipPlacement[];
  sunkenOpponentShips: ShipPlacement[];
}

export enum CellState {
  Empty = 'Empty',
  Miss = 'Miss',
  Hit = 'Hit',
}
