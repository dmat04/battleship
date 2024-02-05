import { GameRoomStatus, GameSettings, PlacedShip } from '../../__generated__/graphql';
import { Coordinates } from '../shipPlacementSlice/types';

export enum GameState {
  PlayerNotReady = 'PlayerNotReady',
  WaitingForOpponentToConnect = 'WaitingForOpponentToConnect',
  WaitingForOpponentToGetReady = 'WaitingForOpponentToGetReady',
  OpponentReady = 'OpponentReady',
  InProgress = 'InProgress',
  Finished = 'Finished',
  OpponentDisconnected = 'OpponentDisconnected',
}

export interface GridState {
  missedCells: Coordinates[];
  hitCells: Coordinates[];
  inaccessibleCells: Coordinates[];
  sunkenShips: PlacedShip[];
}

export interface SliceState {
  gameState: GameState;
  gameSettings: GameSettings | null,
  playerName: string,
  opponentName: string | null,
  currentPlayer: string | null;
  playerShips: PlacedShip[];
  playerGridState: GridState;
  opponentGridState: GridState;
}

export interface GameInitArgs {
  playerName: string;
  opponentName: string | null;
  playerShips: PlacedShip[];
  gameSettings: GameSettings;
  gameRoomStatus: GameRoomStatus;
}
