/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import { SliceState } from './stateTypes';

export const processRemoveNotification = (
  state: SliceState,
  { payload }: PayloadAction<string>,
) => {
  const index = state.notifications.findIndex((n) => n.id === payload);

  if (index < 0) return;

  state.notifications.splice(index, 1);
};

export default { };
