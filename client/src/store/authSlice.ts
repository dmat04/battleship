/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GuestLoginMutation, LoginResult } from "@battleship/common/types/__generated__/types.generated.js";
import LocalStorage from "../utils/localStorageUtils.js";
import { GUEST_LOGIN } from "../graphql/mutations.js";
import { CHECK_USERNAME } from "../graphql/queries.js";
import Dependencies from "../utils/Dependencies.js";
import type { AppDispatch, RootState } from "./store.js";
import { PushTransientNotification } from "./notificationSlice/index.js";
import { NotificationType } from "./notificationSlice/stateTypes.js";
import { clearRoom } from "./gameRoomSlice/index.js";
import { closeWSConnection } from "./wsMiddleware/actions.js";

export const guestLogin = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/indent
  LoginResult | undefined,
  string | null,
  { dispatch: AppDispatch; state: RootState }
>("auth/guestLogin", async (username: string | null, thunkAPI) => {
  const result = await Dependencies.getApolloClient()?.mutate<GuestLoginMutation>({
    mutation: GUEST_LOGIN,
    fetchPolicy: "no-cache",
    variables: {
      username,
    },
  });

  if (result?.data?.guestLogin) {
    void thunkAPI.dispatch(
      PushTransientNotification({
        type: NotificationType.Info,
        timeoutArg: 5000,
        message: "Guest login successful",
      }),
    );

    return result.data.guestLogin;
  }

  return thunkAPI.rejectWithValue({
    error: "Guest login unsuccessful",
  });
});

export const checkUsername: unknown = createAsyncThunk(
  "auth/checkUsername",
  async (username: string) =>
    Dependencies.getApolloClient()?.query({
      query: CHECK_USERNAME,
      fetchPolicy: "no-cache",
      variables: {
        username,
      },
    }),
);

export const logout = createAsyncThunk<
  undefined,
  undefined,
  { dispatch: AppDispatch; state: RootState }
>("auth/logout", (_, thunkAPI) => {
  // TODO: invalidate access token on the server
  LocalStorage.clearAccessToken();
  thunkAPI.dispatch(clearRoom());
  thunkAPI.dispatch(closeWSConnection());
  return undefined;
});

export interface AuthSliceState {
  loginResult: LoginResult | null;
  loginRequestPending: boolean;
}

const initialState: AuthSliceState = {
  loginResult: LocalStorage.getAccessToken(),
  loginRequestPending: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(guestLogin.pending, (state) => {
      state.loginRequestPending = true;
    });
    builder.addCase(guestLogin.fulfilled, (state, action) => {
      state.loginRequestPending = false;

      state.loginResult = action.payload ?? null;

      if (action.payload) {
        LocalStorage.saveAccessToken(action.payload);
      }
    });
    builder.addCase(guestLogin.rejected, (state) => {
      state.loginRequestPending = false;
    });
    builder.addMatcher(logout.settled, () => ({
      loginResult: null,
      loginRequestPending: false,
    }));
  },
});

export default authSlice.reducer;
