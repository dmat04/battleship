import { createAsyncThunk } from "@reduxjs/toolkit";
import { CREATE_ROOM, JOIN_ROOM } from "../../graphql/mutations.js";
import { GET_GAME_SETTINGS } from "../../graphql/queries.js";
import Dependencies from "../../utils/Dependencies.js";
import { openWSConnection } from "../wsMiddleware/actions.js";
import {
  CreateRoomMutation,
  GameSettings,
  GameSettingsQuery,
  JoinRoomMutation,
} from "@battleship/common/types/__generated__/types.generated.js";
import { ThunkAPI } from "../store.js";

export const fetchGameSettings = createAsyncThunk<
  GameSettings,
  string,
  ThunkAPI
>("gameRoom/fetchSettings", async (gameId, thunkAPI) => {
  const settingsResponse =
    await Dependencies.getApolloClient()?.query<GameSettingsQuery>({
      query: GET_GAME_SETTINGS,
      variables: { gameId },
    });

  const gameSettings = settingsResponse?.data.gameSettings;

  if (!gameSettings) {
    return thunkAPI.rejectWithValue({
      error: "Error fetching game settings",
    });
  }

  return gameSettings as GameSettings;
});

export const createGameRoom = createAsyncThunk<
  { roomID: string, inviteCode: string },
  void,
  ThunkAPI
>(
  "gameRoom/create",
  async (_, thunkAPI) => {
    const roomResponse =
      await Dependencies.getApolloClient()?.mutate<CreateRoomMutation>({
        mutation: CREATE_ROOM,
      });
    const { roomID, inviteCode, wsAuthCode } =
      roomResponse?.data?.createRoom ?? {};

    if (!roomID || !inviteCode || !wsAuthCode) {
      return thunkAPI.rejectWithValue({ error: "Error creating game room" });
    }

    void thunkAPI.dispatch(openWSConnection({ roomID, wsAuthCode }));
    void thunkAPI.dispatch(fetchGameSettings(roomID));

    return {
      roomID,
      inviteCode,
    };
  },
);

export const joinGameRoom = createAsyncThunk<
  { roomID: string, inviteCode: undefined },
  string,
  ThunkAPI
>(
  "gameRoom/join",
  async (inviteCode, thunkAPI) => {
    const roomResponse =
      await Dependencies.getApolloClient()?.mutate<JoinRoomMutation>({
        mutation: JOIN_ROOM,
        variables: { inviteCode },
      });

    const { roomID, wsAuthCode } = roomResponse?.data?.joinRoom ?? {};

    if (!roomID || !wsAuthCode) {
      return thunkAPI.rejectWithValue({ error: "Error joining game room" });
    }

    void thunkAPI.dispatch(openWSConnection({ roomID, wsAuthCode }));
    void thunkAPI.dispatch(fetchGameSettings(roomID));

    return {
      roomID,
      inviteCode: undefined,
    };
  },
);
