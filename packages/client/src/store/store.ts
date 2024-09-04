import { Middleware, combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./authSlice.js";
import shipPlacementReducer from "./shipPlacementSlice/index.js";
import gameRoomReducer from "./gameRoomSlice/index.js";
import notificationReducer from "./notificationSlice/index.js";

const rootReducer = combineReducers({
  auth: authReducer,
  shipPlacement: shipPlacementReducer,
  gameRoom: gameRoomReducer,
  notification: notificationReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>, ...middleware: Middleware[]) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
  });
};

export type Store = ReturnType<typeof setupStore>;

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = Store["dispatch"];

export interface ThunkAPI {
  state: RootState;
  dispatch: AppDispatch;
}

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
