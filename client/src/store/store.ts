import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import shipPlacementReducer from './shipPlacementSlice';
import gameRoomReducer from './gameRoomSlice';
import wsMiddleware from './wsMiddleware';
import notificationReducer from './notificationSlice';
import messageListenerMiddleware from './messageListenerMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shipPlacement: shipPlacementReducer,
    gameRoom: gameRoomReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(wsMiddleware, messageListenerMiddleware)
  ),
});

export type Store = typeof store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;