import {
  GameSettings,
  ShipClass,
  ShipClassName,
  ShipPlacement,
} from '../../__generated__/graphql';
import { Coordinates } from '../shipPlacementSlice/types';
import { OpponentMoveResultMessage, OwnMoveResultMessage } from './messageTypes';

export interface SliceState {
  gameState: GameState;
  username: string,
  gameSettings: GameSettings | null,
  shipClasses: Map<ShipClassName, ShipClass>,
  currentPlayer: string | null;
  playerShips: ShipPlacement[];
  playerGridState: GridState;
  opponentGridState: GridState;
  moveResultQueue: (OpponentMoveResultMessage | OwnMoveResultMessage)[];
  pendingMoveResult: OpponentMoveResultMessage | OwnMoveResultMessage | null;
}

export interface GridState {
  missedCells: Coordinates[];
  hitCells: Coordinates[];
  sunkenShips: ShipPlacement[];
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
