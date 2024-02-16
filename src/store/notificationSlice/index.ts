import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  Notification, TransientNotificationArgs, SliceState, PermanentNotificationArgs, NotificationType,
} from './stateTypes';
import { processRemoveNotification } from './utils';
import type { AppDispatch, RootState } from '../store';

const MIN_TIMEOUT = 5000;

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

    const notification: Notification = {
      id: thunkAPI.requestId,
      type,
      message,
      expiresAt: Date.now() + timeout,
    };

    setTimeout(
      () => thunkAPI.dispatch(removeNotification(notification.id)),
      timeout,
    );

    return notification;
  },
);

const initialState: SliceState = {
  notifications: [],
};

const stubState: SliceState = {
  notifications: [
    {
      id: 'first',
      message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea consectetur non inventore.',
      type: NotificationType.Info,
    },
    {
      id: 'second',
      message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea consectetur non inventore.',
      type: NotificationType.Warning,
    },
    {
      id: 'third',
      message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea consectetur non inventore.',
      type: NotificationType.Error,
    },
  ],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: stubState,
  reducers: {
    removeNotification: processRemoveNotification,
  },
  extraReducers: (builder) => {
    builder.addCase(PushTransientNotification.fulfilled, (state, action) => {
      state.notifications.push(action.payload);
    });
    builder.addCase(PushPermanentNotification.fulfilled, (state, action) => {
      state.notifications.push(action.payload);
    });
  },
});

export const {
  removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
