import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Notification, NotificationArgs, SliceState } from './stateTypes';
import { processRemoveNotification } from './utils';
import type { AppDispatch, RootState } from '../store';

const MIN_TIMEOUT = 5000;

export const addNotification = createAsyncThunk<
// eslint-disable-next-line @typescript-eslint/indent
  Notification, NotificationArgs, { dispatch: AppDispatch, state: RootState }
>(
  'notifiaction/add',
  async (args, thunkAPI) => {
    const { message, type, timeoutMs } = args;

    const notification: Notification = {
      id: thunkAPI.requestId,
      type,
      message,
    };

    if (timeoutMs) {
      setTimeout(
        () => thunkAPI.dispatch(removeNotification(notification.id)),
        Math.max(MIN_TIMEOUT, timeoutMs),
      );
    }

    return notification;
  },
);

const initialState: SliceState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    removeNotification: processRemoveNotification,
  },
  extraReducers: (builder) => {
    builder.addCase(addNotification.fulfilled, (state, action) => {
      state.notifications.push(action.payload);
    });
  },
});

export const {
  removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
