import { createSlice } from '@reduxjs/toolkit';
import { SliceState } from './stateTypes';
import { processGameInitAction, processMessageReceived } from './utils';

const initialState: SliceState = {
  gameRoomStatus: {
    currentPlayer: null,
    p1ShipsPlaced: false,
    p1WSOpen: false,
    p2ShipsPlaced: false,
    p2WSOpen: false,
    player1: '',
    player2: '',
  },
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
  },
});

export const {
  initGame,
  messageReceived,
} = activeGameSlice.actions;

export default activeGameSlice.reducer;
