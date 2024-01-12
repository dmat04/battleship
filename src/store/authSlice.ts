/* eslint-disable no-param-reassign */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginResult, UsernameQueryResult } from '../__generated__/graphql';
import LocalStorage from '../utils/localStorageUtils';
import { GUEST_LOGIN } from '../graphql/mutations';
import { CHECK_USERNAME } from '../graphql/queries';
import Dependencies from '../utils/Dependencies';

export const guestLogin = createAsyncThunk(
  'auth/guestLogin',
  async (username: string | null) => Dependencies.getApolloClient()?.mutate({
    mutation: GUEST_LOGIN,
    fetchPolicy: 'no-cache',
    variables: {
      username,
    },
  }),
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

export interface AuthSliceState {
  loginResult: LoginResult | null;
  loginRequestPending: boolean;
  checkUsernameResult: UsernameQueryResult | null;
  checkUsernamePending: boolean;
  checkUsernamePendingRequestID: string | null;
}

const initialState: AuthSliceState = {
  loginResult: LocalStorage.getAccessToken(),
  loginRequestPending: false,
  checkUsernameResult: null,
  checkUsernamePending: false,
  checkUsernamePendingRequestID: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<LoginResult>) => {
      state.loginResult = action.payload;
      state.loginRequestPending = false;
    },
    clearAuth: (state) => {
      state.loginResult = null;
      state.loginRequestPending = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(guestLogin.pending, (state) => {
      state.loginRequestPending = true;
    });
    builder.addCase(guestLogin.fulfilled, (state, action) => {
      state.loginRequestPending = false;
      state.loginResult = action.payload?.data?.guestLogin ?? null;
    });
    builder.addCase(guestLogin.rejected, (state) => {
      state.loginRequestPending = false;
    });
    builder.addCase(checkUsername.pending, (state, action) => {
      state.checkUsernamePendingRequestID = action.meta.requestId;
      state.checkUsernamePending = true;
    });
    builder.addCase(checkUsername.fulfilled, (state, action) => {
      if (action.meta.requestId !== state.checkUsernamePendingRequestID) {
        return;
      }

      state.checkUsernamePending = false;
      state.checkUsernamePendingRequestID = null;
      state.checkUsernameResult = action.payload?.data.checkUsername ?? null;
    });
    builder.addCase(checkUsername.rejected, (state, action) => {
      if (action.meta.requestId !== state.checkUsernamePendingRequestID) {
        return;
      }

      state.checkUsernamePendingRequestID = null;
      state.checkUsernamePending = false;
      state.checkUsernameResult = null;
    });
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
