/* eslint-disable no-param-reassign */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginResult } from '../__generated__/graphql';
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
}

const initialState: AuthSliceState = {
  loginResult: LocalStorage.getAccessToken(),
  loginRequestPending: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<LoginResult>) => {
      state.loginResult = action.payload;
      state.loginRequestPending = false;
      LocalStorage.saveAccessToken(action.payload);
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

      const loginResult = action.payload?.data?.guestLogin;
      state.loginResult = loginResult ?? null;

      if (loginResult) {
        LocalStorage.saveAccessToken(loginResult);
      }
    });
    builder.addCase(guestLogin.rejected, (state) => {
      state.loginRequestPending = false;
    });
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
