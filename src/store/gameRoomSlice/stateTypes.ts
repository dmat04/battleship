import { GameSettings, PlacedShip } from '../../__generated__/graphql';
import { Coordinates } from '../shipPlacementSlice/types';

export interface ScoreState {
  missedCells: Coordinates[];
  hitCells: Coordinates[];
  inaccessibleCells: Coordinates[];
  sunkenShips: PlacedShip[];
}

export enum PlayerStatus {
  Disconnected = 'Disconnected',
  Connected = 'Connected',
  Ready = 'Ready',
}

export enum GameResult {
  PlayerWon = 'PlayerWon',
  OpponentWon = 'OpponentWon',
  OpponentDisconnected = 'OpponentDisconnected',
}

export interface SliceStateInactive {
  roomID?: string;
  gameSettings?: GameSettings;
  playerStatus: PlayerStatus,
  opponentStatus: PlayerStatus,
  playerName?: string;
  opponentName?: string;
  currentPlayer?: string;
  playerShips?: PlacedShip[];
  inviteCode: string | undefined;
  gameStarted: boolean;
  round: number;
  playerScore: ScoreState;
  opponentScore: ScoreState;
  gameResult: GameResult | null;
  requestStatus: {
    loadingNewRoom: boolean;
    loadingJoinRoom: boolean;
    loadingSettings: boolean;
  }
}

export type SliceStateActive = Required<SliceStateInactive>;

// eslint-disable-next-line arrow-body-style
export const GameRoomIsReady = (state: SliceState): state is SliceStateActive => {
  return state.roomID !== undefined
    && state.gameSettings !== undefined
    && state.playerName !== undefined
    && state.opponentName !== undefined
    && state.currentPlayer !== undefined
    && state.playerShips !== undefined
    && state.opponentStatus === PlayerStatus.Ready
    && state.playerStatus === PlayerStatus.Ready;
};

// eslint-disable-next-line arrow-body-style
export const GameIsInProgress = (state: SliceState): state is SliceStateActive => {
  return GameRoomIsReady(state)
    && state.gameStarted
    && state.gameResult === null;
};

// eslint-disable-next-line arrow-body-style
export const GameIsFinished = (state: SliceState): boolean => {
  return GameRoomIsReady(state)
    && state.gameResult !== null;
};

export type SliceState = SliceStateInactive | SliceStateActive;

export const initialState: SliceStateInactive = {
  roomID: undefined,
  gameSettings: undefined,
  playerStatus: PlayerStatus.Disconnected,
  opponentStatus: PlayerStatus.Disconnected,
  playerName: undefined,
  opponentName: undefined,
  currentPlayer: undefined,
  playerShips: undefined,
  inviteCode: undefined,
  gameStarted: false,
  round: 0,
  gameResult: null,
  playerScore: {
    hitCells: [],
    missedCells: [],
    inaccessibleCells: [],
    sunkenShips: [],
  },
  opponentScore: {
    hitCells: [],
    missedCells: [],
    inaccessibleCells: [],
    sunkenShips: [],
  },
  requestStatus: {
    loadingJoinRoom: false,
    loadingNewRoom: false,
    loadingSettings: false,
  },
};
