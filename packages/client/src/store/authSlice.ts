/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GithubLoginMutation,
  GuestLoginMutation,
  LoginResult,
  RegisteredLoginMutation,
} from "@battleship/common/types/__generated__/types.generated.js";
import LocalStorage from "../utils/localStorageUtils.js";
import { GITHUB_LOGIN, GUEST_LOGIN, REGISTERED_LOGIN } from "../graphql/mutations.js";
import { CHECK_USERNAME } from "../graphql/queries.js";
import Dependencies from "../utils/Dependencies.js";
import type { ThunkAPI } from "./store.js";
import { PushTransientNotification } from "./notificationSlice/index.js";
import { NotificationType } from "./notificationSlice/stateTypes.js";
import { clearRoom } from "./gameRoomSlice/index.js";
import { closeWSConnection } from "./wsMiddleware/actions.js";

export const guestLogin = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/indent
  LoginResult | undefined,
  string | null,
  ThunkAPI
>("auth/guestLogin", async (username: string | null, thunkAPI) => {
  const result =
    await Dependencies.getApolloClient()?.mutate<GuestLoginMutation>({
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

export const registeredLogin = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/indent
  LoginResult | undefined,
  { username: string, password: string },
  ThunkAPI
>("auth/registeredLogin", async ({ username, password }, thunkAPI) => {
  const result =
    await Dependencies.getApolloClient()?.mutate<RegisteredLoginMutation>({
      mutation: REGISTERED_LOGIN,
      fetchPolicy: "no-cache",
      variables: {
        username,
        password
      },
    });

  if (result?.data?.registeredLogin) {
    void thunkAPI.dispatch(
      PushTransientNotification({
        type: NotificationType.Info,
        timeoutArg: 5000,
        message: "Login successful",
      }),
    );

    return result.data.registeredLogin;
  }

  return thunkAPI.rejectWithValue({
    error: "Login failed",
  });
});

export const githubLogin = createAsyncThunk<
  LoginResult | undefined,
  { accessCode: string; state: string },
  ThunkAPI
>("auth/githubLogin", async ({ accessCode, state }, thunkAPI) => {
  const savedState = LocalStorage.getGithubOAuthState();

  if (savedState !== state) {
    return thunkAPI.rejectWithValue({
      error: "Github login unsuccessful",
    });
  }

  const result =
    await Dependencies.getApolloClient()?.mutate<GithubLoginMutation>({
      mutation: GITHUB_LOGIN,
      fetchPolicy: "no-cache",
      variables: {
        accessCode,
      },
    });

  if (result?.data?.githubLogin) {
    void thunkAPI.dispatch(
      PushTransientNotification({
        type: NotificationType.Info,
        timeoutArg: 5000,
        message: "Github login successful",
      }),
    );

    return result.data.githubLogin;
  }

  return thunkAPI.rejectWithValue({
    error: "Github login unsuccessful",
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

export const logout = createAsyncThunk<undefined, undefined, ThunkAPI>(
  "auth/logout",
  (_, thunkAPI) => {
    // TODO: invalidate access token on the server
    LocalStorage.clearAccessToken();
    thunkAPI.dispatch(clearRoom());
    thunkAPI.dispatch(closeWSConnection());
    return undefined;
  },
);

export interface AuthSliceState {
  loginResult: LoginResult | null;
  loginRequestPending: boolean;
  githubLoginPending: boolean;
}

const initialState: AuthSliceState = {
  loginResult: LocalStorage.getAccessToken(),
  loginRequestPending: false,
  githubLoginPending: false,
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
    builder.addCase(registeredLogin.pending, (state) => {
      state.loginRequestPending = true;
    });
    builder.addCase(registeredLogin.fulfilled, (state, action) => {
      state.loginRequestPending = false;

      state.loginResult = action.payload ?? null;

      if (action.payload) {
        LocalStorage.saveAccessToken(action.payload);
      }
    });
    builder.addCase(registeredLogin.rejected, (state) => {
      state.loginRequestPending = false;
    });
    builder.addCase(githubLogin.pending, (state) => {
      state.githubLoginPending = true;
    });
    builder.addCase(githubLogin.fulfilled, (state, action) => {
      LocalStorage.clearGithubOAuthState();
      state.loginResult = action.payload ?? null;
      state.githubLoginPending = false;

      if (action.payload) {
        LocalStorage.saveAccessToken(action.payload);
      }
    });
    builder.addCase(githubLogin.rejected, (state) => {
      LocalStorage.clearGithubOAuthState();
      state.githubLoginPending = false;
    });
    builder.addMatcher(logout.settled, () => ({
      loginResult: null,
      loginRequestPending: false,
      githubOAuthState: null,
      githubLoginPending: false,
    }));
  },
});

export default authSlice.reducer;
