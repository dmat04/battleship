/* eslint-disable no-param-reassign */
import { UnknownAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GameSettings } from '../__generated__/graphql';
import { CREATE_ROOM, JOIN_ROOM } from '../graphql/mutations';
import Dependencies from '../utils/Dependencies';
import { GET_GAME_SETTINGS } from '../graphql/queries';

export type GameRoomSliceState = {
  roomID?: string;
  inviteCode?: string;
  wsAuthCode?: string;
  gameSettings?: GameSettings;
  fetchingRoom: boolean;
  fetchingSettings: boolean;
};

const initialState: GameRoomSliceState = {
  roomID: undefined,
  inviteCode: undefined,
  wsAuthCode: undefined,
  gameSettings: undefined,
  fetchingRoom: false,
  fetchingSettings: false,
};

export const fetchGameSettings = createAsyncThunk(
  'gameRoom/fetchSettings',
  async (gameId: string, thunkAPI) => {
    const settingsResponse = await Dependencies.getApolloClient()?.query({
      query: GET_GAME_SETTINGS,
      variables: { gameId },
    });

    const gameSettings = settingsResponse?.data.gameSettings;

    if (!gameSettings) {
      return thunkAPI.rejectWithValue({ error: 'Error fetching game settings' });
    }

    return gameSettings;
  },
);

export const createGameRoom = createAsyncThunk(
  'gameRoom/create',
  async (_, thunkAPI) => {
    const roomResponse = await Dependencies.getApolloClient()?.mutate({ mutation: CREATE_ROOM });
    const {
      roomID,
      inviteCode,
      wsAuthCode,
    } = roomResponse?.data?.createRoom ?? {};

    if (!roomID || !inviteCode || !wsAuthCode) {
      return thunkAPI.rejectWithValue({ error: 'Error creating game room' });
    }

    thunkAPI.dispatch(fetchGameSettings(roomID));

    return {
      roomID,
      inviteCode,
      wsAuthCode,
    };
  },
);

export const joinGameRoom = createAsyncThunk(
  'gameRoom/join',
  async (inviteCode: string, thunkAPI) => {
    const roomResponse = await Dependencies.getApolloClient()?.mutate({
      mutation: JOIN_ROOM,
      variables: { inviteCode },
    });

    const { roomID, wsAuthCode } = roomResponse?.data?.joinRoom ?? {};

    if (!roomID || !wsAuthCode) {
      return thunkAPI.rejectWithValue({ error: 'Error joining game room' });
    }

    thunkAPI.dispatch(fetchGameSettings(roomID));

    return {
      roomID,
      inviteCode: undefined,
      wsAuthCode,
    };
  },
);

const isRoomPendingAction = (action: UnknownAction) => (
  action.type === createGameRoom.pending.type
  || action.type === joinGameRoom.pending.type
);

const isRoomFullfilledAction = (
  action: UnknownAction,
): action is ReturnType<typeof createGameRoom['fulfilled']> => (
  action.type === createGameRoom.fulfilled.type
  || action.type === joinGameRoom.fulfilled.type
);

const isRoomRejectedAction = (action: UnknownAction) => (
  action.type === createGameRoom.rejected.type
  || action.type === joinGameRoom.rejected.type
);

const gameRoomSlice = createSlice({
  name: 'gameRoom',
  initialState: initialState as GameRoomSliceState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGameSettings.pending, (state) => {
      state.fetchingSettings = true;
    });
    builder.addCase(fetchGameSettings.fulfilled, (state, action) => {
      state.fetchingSettings = false;
      state.gameSettings = action.payload;
    });
    builder.addCase(fetchGameSettings.rejected, (state) => {
      state.fetchingSettings = false;
      state.gameSettings = undefined;
    });
    builder.addMatcher(isRoomPendingAction, (state) => {
      state.fetchingRoom = true;
    });
    builder.addMatcher(isRoomFullfilledAction, (state, action) => {
      const { roomID, inviteCode, wsAuthCode } = action.payload;
      state.fetchingRoom = false;
      state.roomID = roomID;
      state.inviteCode = inviteCode;
      state.wsAuthCode = wsAuthCode;
    });
    builder.addMatcher(isRoomRejectedAction, (state) => {
      state.fetchingRoom = false;
      state.roomID = undefined;
      state.inviteCode = undefined;
      state.wsAuthCode = undefined;
    });
  },
});

export default gameRoomSlice.reducer;
