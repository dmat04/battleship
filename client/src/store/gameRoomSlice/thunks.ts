import { createAsyncThunk } from "@reduxjs/toolkit";
import { CREATE_ROOM, JOIN_ROOM } from "../../graphql/mutations.js";
import { GET_GAME_SETTINGS } from "../../graphql/queries.js";
import Dependencies from "../../utils/Dependencies.js";
import { openWSConnection } from "../wsMiddleware/actions.js";

export const fetchGameSettings = createAsyncThunk(
  "gameRoom/fetchSettings",
  async (gameId: string, thunkAPI) => {
    const settingsResponse = await Dependencies.getApolloClient()?.query({
      query: GET_GAME_SETTINGS,
      variables: { gameId },
    });

    const gameSettings = settingsResponse?.data.gameSettings;

    if (!gameSettings) {
      return thunkAPI.rejectWithValue({
        error: "Error fetching game settings",
      });
    }

    return gameSettings;
  },
);

export const createGameRoom = createAsyncThunk(
  "gameRoom/create",
  async (_, thunkAPI) => {
    const roomResponse = await Dependencies.getApolloClient()?.mutate({
      mutation: CREATE_ROOM,
    });
    const { roomID, inviteCode, wsAuthCode } =
      roomResponse?.data?.createRoom ?? {};

    if (!roomID || !inviteCode || !wsAuthCode) {
      return thunkAPI.rejectWithValue({ error: "Error creating game room" });
    }

    thunkAPI.dispatch(openWSConnection({ roomID, wsAuthCode }));
    thunkAPI.dispatch(fetchGameSettings(roomID));

    return {
      roomID,
      inviteCode,
    };
  },
);

export const joinGameRoom = createAsyncThunk(
  "gameRoom/join",
  async (inviteCode: string, thunkAPI) => {
    const roomResponse = await Dependencies.getApolloClient()?.mutate({
      mutation: JOIN_ROOM,
      variables: { inviteCode },
    });

    const { roomID, wsAuthCode } = roomResponse?.data?.joinRoom ?? {};

    if (!roomID || !wsAuthCode) {
      return thunkAPI.rejectWithValue({ error: "Error joining game room" });
    }

    thunkAPI.dispatch(openWSConnection({ roomID, wsAuthCode }));
    thunkAPI.dispatch(fetchGameSettings(roomID));

    return {
      roomID,
      inviteCode: undefined,
    };
  },
);
