import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GameRoomStatus, GameSettings } from '../__generated__/graphql';
import { CREATE_ROOM, GET_GAME_SETTINGS } from '../graphql/mutations';
import apolloClient from '../utils/apolloClient';

export type GameRoomSliceState = {
  roomID?: string;
  roomStatus?: GameRoomStatus;
  gameSettings?: GameSettings
};

const initialState: GameRoomSliceState = {
  roomID: undefined,
  roomStatus: undefined,
  gameSettings: undefined,
};

export const createGameRoom = createAsyncThunk(
  'gameRoom/create',
  async () => {
    const roomResponse = await apolloClient.mutate({ mutation: CREATE_ROOM });
    const roomID = roomResponse.data?.createRoom.roomID ?? '';
    const settingsResponse = await apolloClient.query({
      query: GET_GAME_SETTINGS,
      variables: { gameId: roomID },
    });

    return {
      roomID,
      roomStatus: undefined,
      gameSettings: settingsResponse.data.gameSettings ?? null,
    };
  },
);

const gameRoomSlice = createSlice({
  name: 'gameRoom',
  initialState: initialState as GameRoomSliceState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGameRoom.fulfilled, (state, action) => {
        const { roomID, roomStatus, gameSettings } = action.payload;
        if (roomID && roomStatus && gameSettings) {
          return { roomID, roomStatus, gameSettings };
        }

        return state;
      });
  },
});

export default gameRoomSlice.reducer;
