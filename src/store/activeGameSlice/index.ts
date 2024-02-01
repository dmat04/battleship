import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GameState, SliceState } from './stateTypes';
import {
  processGameInitAction,
  processMessageReceived,
  canHitOpponentCell,
} from './utils';
import { Coordinates } from '../shipPlacementSlice/types';
import type { AppDispatch, RootState } from '../store';
import stateStub from './stateStub';

export const hitOpponentCell = createAction<Coordinates>('sendMessage/hitOpponentCell');

export const requestRoomStatus = createAction('sendMessage/requestRoomStatus');

export const opponentCellClicked = createAsyncThunk<
// eslint-disable-next-line @typescript-eslint/indent
  void, Coordinates, { dispatch: AppDispatch, state: RootState }
>(
  'activeGame/opponentCellClicked',
  async (cell: Coordinates, thunkAPI) => {
    const gameState = thunkAPI.getState().activeGame;
    if (canHitOpponentCell(gameState, cell)) {
      thunkAPI.dispatch(hitOpponentCell(cell));
    }
  },
);

const initialState: SliceState = {
  gameState: GameState.PlayerNotReady,
  username: '',
  gameSettings: null,
  currentPlayer: null,
  playerShips: [],
  playerGridState: {
    hitCells: [],
    missedCells: [],
    sunkenShips: [],
    inaccessibleCells: [],
  },
  opponentGridState: {
    hitCells: [],
    missedCells: [],
    sunkenShips: [],
    inaccessibleCells: [],
  },
};

const activeGameSlice = createSlice({
  name: 'activeGame',
  initialState: stateStub,
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
