import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  Notification,
  TransientNotificationArgs,
  SliceState,
  PermanentNotificationArgs,
  TransientData,
} from './stateTypes';
import { processRemoveNotification } from './utils';
import type { AppDispatch, RootState } from '../store';

const MIN_TIMEOUT = 5000;

export const dismissNotification = createAction<string>('notification/dismiss');

export const PushPermanentNotification = createAsyncThunk<
// eslint-disable-next-line @typescript-eslint/indent
  Notification, PermanentNotificationArgs, { dispatch: AppDispatch, state: RootState }
>(
  'notification/addPermanent',
  async (args, thunkAPI) => {
    const { message, type } = args;

    const notification: Notification = {
      id: thunkAPI.requestId,
      type,
      message,
    };

    return notification;
  },
);

export const PushTransientNotification = createAsyncThunk<
// eslint-disable-next-line @typescript-eslint/indent
  Notification, TransientNotificationArgs, { dispatch: AppDispatch, state: RootState }
>(
  'notification/addTransient',
  async (args, thunkAPI) => {
    const { message, type, timeoutArg } = args;

    const timeout = Math.max(MIN_TIMEOUT, timeoutArg);

    const transientInfo: TransientData = {
      expiresAt: Date.now() + timeout,
      timeoutID: setTimeout(
        () => thunkAPI.dispatch(dismissNotification(thunkAPI.requestId)),
        timeout,
      ),
    };

    const notification: Notification = {
      id: thunkAPI.requestId,
      type,
      message,
      transientInfo,
    };

    return notification;
  },
);

const initialState: SliceState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder.addCase(PushTransientNotification.fulfilled, (state, action) => {
      state.notifications.push(action.payload);
    });
    builder.addCase(PushPermanentNotification.fulfilled, (state, action) => {
      state.notifications.push(action.payload);
    });
    builder.addCase(dismissNotification, (state, action) => {
      processRemoveNotification(state, action);
    });
  },
});

export default notificationSlice.reducer;
