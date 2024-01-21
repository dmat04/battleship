import { createAction, createSlice } from '@reduxjs/toolkit';
import { GameState, SliceState } from './stateTypes';
import {
  processGameInitAction,
  processMessageReceived,
  processAcknowledgePendingMessage,
} from './utils';
import { Coordinates } from '../shipPlacementSlice/types';

const initialState: SliceState = {
  gameState: GameState.PlayerNotReady,
  username: '',
  currentPlayer: null,
  playerShips: [],
  playerGrid: [],
  opponentGrid: [],
  sunkenPayerShips: [],
  sunkenOpponentShips: [],
  messageQueue: [],
  pendingMessage: null,
};

const activeGameSlice = createSlice({
  name: 'activeGame',
  initialState,
  reducers: {
    initGame: processGameInitAction,
    messageReceived: processMessageReceived,
    acknowledgePendingMessage: processAcknowledgePendingMessage,
  },
});

export const {
  initGame,
  messageReceived,
  acknowledgePendingMessage,
} = activeGameSlice.actions;

export const hitOpponentCell = createAction<Coordinates>('sendMessage/hitOpponentCell');

export default activeGameSlice.reducer;
