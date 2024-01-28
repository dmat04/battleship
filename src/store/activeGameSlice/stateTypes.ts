import { GameRoomStatus, GameSettings } from '../../__generated__/graphql';
import { Coordinates, ShipState } from '../shipPlacementSlice/types';
import { OpponentMoveResultMessage, OwnMoveResultMessage, ShipPlacement } from './messageTypes';

export interface SliceState {
  gameState: GameState;
  username: string,
  gameSettings: GameSettings | null,
  currentPlayer: string | null;
  playerShips: ShipPlacement[];
  playerGridState: GridState;
  opponentGridState: GridState;
  moveResultQueue: (OpponentMoveResultMessage | OwnMoveResultMessage)[];
}

export interface GridState {
  missedCells: Coordinates[];
  hitCells: Coordinates[];
  inaccessibleCells: Coordinates[];
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

export interface GameInitArgs {
  playerName: string;
  playerShips: ShipState[];
  gameSettings: GameSettings;
  gameRoomStatus: GameRoomStatus;
}
