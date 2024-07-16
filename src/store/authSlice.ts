/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginResult } from '../__generated__/graphql';
import LocalStorage from '../utils/localStorageUtils';
import { GUEST_LOGIN } from '../graphql/mutations';
import { CHECK_USERNAME } from '../graphql/queries';
import Dependencies from '../utils/Dependencies';
import type { AppDispatch, RootState } from './store';
import { PushTransientNotification } from './notificationSlice';
import { NotificationType } from './notificationSlice/stateTypes';
import { clearRoom } from './gameRoomSlice';
import { closeWSConnection } from './wsMiddleware/actions';

export const guestLogin = createAsyncThunk<
// eslint-disable-next-line @typescript-eslint/indent
  LoginResult | undefined, string | null, { dispatch: AppDispatch, state: RootState }
>(
  'auth/guestLogin',
  async (username: string | null, thunkAPI) => {
    const result = await Dependencies.getApolloClient()?.mutate({
      mutation: GUEST_LOGIN,
      fetchPolicy: 'no-cache',
      variables: {
        username,
      },
    });

    if (result?.data?.guestLogin) {
      thunkAPI.dispatch(PushTransientNotification({
        type: NotificationType.Info,
        timeoutArg: 5000,
        message: 'Guest login successful',
      }));

      return result.data.guestLogin;
    }

    return thunkAPI.rejectWithValue({
      error: 'Guest login unsuccessful',
    });
  },
);

export const checkUsername = createAsyncThunk(
  'auth/checkUsername',
  async (username: string) => Dependencies.getApolloClient()?.query({
    query: CHECK_USERNAME,
    fetchPolicy: 'no-cache',
    variables: {
      username,
    },
  }),
);

export const logout = createAsyncThunk<
// eslint-disable-next-line @typescript-eslint/indent
  undefined, undefined, { dispatch: AppDispatch, state: RootState }
>(
  'auth/logout',
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
}

const initialState: AuthSliceState = {
  loginResult: LocalStorage.getAccessToken(),
  loginRequestPending: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { },
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
