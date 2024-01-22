import { createAction, createSlice } from '@reduxjs/toolkit';
import { GameState, SliceState } from './stateTypes';
import {
  processGameInitAction,
  processMessageReceived,
  processAcknowledgeMoveResult,
} from './utils';
import { Coordinates } from '../shipPlacementSlice/types';
import { ShipClass, ShipClassName } from '../../__generated__/graphql';

const initialState: SliceState = {
  gameState: GameState.PlayerNotReady,
  username: '',
  gameSettings: null,
  shipClasses: new Map<ShipClassName, ShipClass>(),
  currentPlayer: null,
  playerShips: [],
  playerGridState: {
    hitCells: [],
    missedCells: [],
    sunkenShips: [],
  },
  opponentGridState: {
    hitCells: [],
    missedCells: [],
    sunkenShips: [],
  },
  moveResultQueue: [],
  pendingMoveResult: null,
};

const activeGameSlice = createSlice({
  name: 'activeGame',
  initialState,
  reducers: {
    initGame: processGameInitAction,
    messageReceived: processMessageReceived,
    acknowledgeMoveResult: processAcknowledgeMoveResult,
  },
});

export const {
  initGame,
  messageReceived,
  acknowledgeMoveResult,
} = activeGameSlice.actions;

export const hitOpponentCell = createAction<Coordinates>('sendMessage/hitOpponentCell');

export const requestRoomStatus = createAction('sendMessage/requestRoomStatus');

export default activeGameSlice.reducer;
