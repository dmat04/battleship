import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LoginResult } from '../__generated__/graphql';
import LocalStorage from '../utils/localStorageUtils';

export type AuthSliceState = LoginResult | null;

const authSlice = createSlice({
  name: 'auth',
  initialState: LocalStorage.getAccessToken(),
  reducers: {
    setAuth: (_, action: PayloadAction<LoginResult>) => action.payload,
    clearAuth: () => null,
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
