import { createSlice } from '@reduxjs/toolkit';
import { SliceState } from './stateTypes';
import { processAddNotification } from './utils';

const initialState: SliceState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: processAddNotification,
  },
});

export const {
  addNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
