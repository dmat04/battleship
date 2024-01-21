import { ShipPlacement } from '../../__generated__/graphql';
import { OpponentMoveResultMessage, OwnMoveResultMessage } from './messageTypes';

export interface SliceState {
  gameState: GameState;
  username: string,
  currentPlayer: string | null;
  playerShips: ShipPlacement[];
  playerGrid: CellState[][];
  opponentGrid: CellState[][];
  sunkenPayerShips: ShipPlacement[];
  sunkenOpponentShips: ShipPlacement[];
  moveResultQueue: (OpponentMoveResultMessage | OwnMoveResultMessage)[];
  pendingMoveResult: OpponentMoveResultMessage | OwnMoveResultMessage | null;
}

export enum CellState {
  Empty = 'Empty',
  Miss = 'Miss',
  Hit = 'Hit',
}

export enum GameState {
  PlayerNotReady = 'PlayerNotReady',
  WaitingForOpponentToConnect = 'WaitingForOpponentToConnect',
  WaitingForOpponentToGetReady = 'WaitingForOpponentToGetReady',
  OpponentReady = 'OpponentReady',
  InProgress = 'InProgress',
  Finished = 'Finished',
  OpponentDisconnected = 'OpponentDisconnected',
}
