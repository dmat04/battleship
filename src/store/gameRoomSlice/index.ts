/* eslint-disable no-param-reassign */
import { UnknownAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PlayerStatus, SliceState, SliceStateInactive } from './stateTypes';
import {
  processMessageReceived,
  canHitOpponentCell,
  processRoomStatus,
} from './utils';
import { Coordinates } from '../shipPlacementSlice/types';
import type { AppDispatch, RootState } from '../store';
import { sendMessage, messageReceived } from '../wsMiddleware/actions';
import { ClientMessageCode, ShootMessage } from '../wsMiddleware/messageTypes';
import { submitPlacement } from '../shipPlacementSlice/thunks';
import { createGameRoom, joinGameRoom, fetchGameSettings } from './thunks';

const isRoomFullfilledAction = (
  action: UnknownAction,
): action is ReturnType<typeof createGameRoom['fulfilled']> => (
  action.type === createGameRoom.fulfilled.type
  || action.type === joinGameRoom.fulfilled.type
);

export const opponentCellClicked = createAsyncThunk<
// eslint-disable-next-line @typescript-eslint/indent
  void, Coordinates, { dispatch: AppDispatch, state: RootState }
>(
  'gameRoom/opponentCellClicked',
  async (cell: Coordinates, thunkAPI) => {
    const gameState = thunkAPI.getState().gameRoom;
    if (canHitOpponentCell(gameState, cell)) {
      const message: ShootMessage = {
        code: ClientMessageCode.Shoot,
        x: cell.x,
        y: cell.y,
      };

      thunkAPI.dispatch(sendMessage(message));
    }
  },
);

const initialState: SliceStateInactive = {
  roomID: undefined,
  gameSettings: undefined,
  playerStatus: PlayerStatus.Connected,
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

const gameRoomSlice = createSlice({
  name: 'activeGame',
  initialState: initialState as SliceState,
  reducers: {
    clearRoom: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(messageReceived, (state, action) => {
      processMessageReceived(state, action);
    });
    builder.addCase(submitPlacement.fulfilled, (state, action) => {
      if (action.payload) {
        state.playerShips = action.payload.placedShips;
        processRoomStatus(state, action.payload.gameRoomStatus);
      }
    });
    builder.addCase(fetchGameSettings.pending, (state) => {
      state.requestStatus.loadingSettings = true;
    });
    builder.addCase(fetchGameSettings.fulfilled, (state, action) => {
      state.requestStatus.loadingSettings = false;
      state.gameSettings = action.payload;
    });
    builder.addCase(fetchGameSettings.rejected, (state) => {
      state.requestStatus.loadingSettings = false;
      state.gameSettings = undefined;
    });
    builder.addCase(createGameRoom.pending, (state) => {
      state.requestStatus.loadingNewRoom = true;
    });
    builder.addCase(joinGameRoom.pending, (state) => {
      state.requestStatus.loadingJoinRoom = true;
    });
    builder.addCase(createGameRoom.rejected, (state) => {
      state.requestStatus.loadingNewRoom = false;
    });
    builder.addCase(joinGameRoom.rejected, (state) => {
      state.requestStatus.loadingJoinRoom = false;
    });
    builder.addMatcher(isRoomFullfilledAction, (state, action) => {
      const { roomID, inviteCode } = action.payload;
      state.requestStatus.loadingNewRoom = false;
      state.requestStatus.loadingJoinRoom = false;
      state.roomID = roomID;
      state.inviteCode = inviteCode;
    });
  },
});

export const {
  clearRoom,
} = gameRoomSlice.actions;

export default gameRoomSlice.reducer;
