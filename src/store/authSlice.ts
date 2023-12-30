import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getAccessToken } from "../utils/localStorageUtils";
import { LoginResult } from "../types/ServerTypes";

export type AuthSliceState = LoginResult | null;

const authSlice = createSlice({
  name: 'auth',
  initialState: null as AuthSliceState,
  reducers: {
    setAuth: (_, action: PayloadAction<LoginResult>) => action.payload,
    clearAuth: () => null,
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
