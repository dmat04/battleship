import { GameSettings, PlacedShip } from '../../__generated__/graphql';
import { Coordinates } from '../shipPlacementSlice/types';

export enum GameStateValues {
  PlayerNotReady = 'PlayerNotReady',
  WaitingForOpponentToConnect = 'WaitingForOpponentToConnect',
  WaitingForOpponentToGetReady = 'WaitingForOpponentToGetReady',
  OpponentReady = 'OpponentReady',
  InProgress = 'InProgress',
  Finished = 'Finished',
  OpponentDisconnected = 'OpponentDisconnected',
}

export type GameState =
  GameStateValues.PlayerNotReady |
  GameStateValues.WaitingForOpponentToConnect |
  GameStateValues.WaitingForOpponentToGetReady |
  GameStateValues.OpponentReady |
  GameStateValues.InProgress |
  GameStateValues.Finished |
  GameStateValues.OpponentDisconnected;

export interface ScoreState {
  missedCells: Coordinates[];
  hitCells: Coordinates[];
  inaccessibleCells: Coordinates[];
  sunkenShips: PlacedShip[];
}

export interface SliceStateInactive {
  gameState: Exclude<GameState, GameStateValues.InProgress>;
  roomID?: string;
  inviteCode: string | undefined;
  gameSettings?: GameSettings;
  playerName?: string;
  opponentName?: string;
  currentPlayer?: string;
  playerShips?: PlacedShip[];
  requestStatus: {
    loadingNewRoom: boolean;
    loadingJoinRoom: boolean;
    loadingSettings: boolean;
  }
}

export type SliceStateActive = Required<Omit<SliceStateInactive, 'gameState'>> & {
  gameState: GameStateValues.InProgress;
  playerScore: ScoreState;
  opponentScore: ScoreState;
};

// eslint-disable-next-line arrow-body-style
export const StateIsActive = (state: SliceState): state is SliceStateActive => {
  return state.roomID !== undefined
    && state.gameSettings !== undefined
    && state.playerName !== undefined
    && state.opponentName !== undefined
    && state.currentPlayer !== undefined
    && state.playerShips !== undefined
    && state.gameState === GameStateValues.OpponentReady;
};

export type SliceState = SliceStateInactive | SliceStateActive;
