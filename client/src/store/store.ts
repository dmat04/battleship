import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./authSlice.js";
import shipPlacementReducer from "./shipPlacementSlice/index.js";
import gameRoomReducer from "./gameRoomSlice/index.js";
import wsMiddleware from "./wsMiddleware/index.js";
import notificationReducer from "./notificationSlice/index.js";
import messageListenerMiddleware from "./messageListenerMiddleware/index.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shipPlacement: shipPlacementReducer,
    gameRoom: gameRoomReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wsMiddleware, messageListenerMiddleware),
});

export type Store = typeof store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
