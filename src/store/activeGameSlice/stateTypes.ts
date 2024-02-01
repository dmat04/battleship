import { GameRoomStatus, GameSettings, PlacedShip } from '../../__generated__/graphql';
import { Coordinates } from '../shipPlacementSlice/types';
import { OpponentMoveResultMessage, OwnMoveResultMessage } from '../wsMiddleware/messageTypes';

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
  username: string,
  gameSettings: GameSettings | null,
  currentPlayer: string | null;
  playerShips: PlacedShip[];
  playerGridState: GridState;
  opponentGridState: GridState;
  moveResultQueue: (OpponentMoveResultMessage | OwnMoveResultMessage)[];
}

export interface GameInitArgs {
  playerName: string;
  playerShips: PlacedShip[];
  gameSettings: GameSettings;
  gameRoomStatus: GameRoomStatus;
}
