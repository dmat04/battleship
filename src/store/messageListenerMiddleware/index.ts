import { Middleware } from '@reduxjs/toolkit';
import { messageReceived } from '../wsMiddleware/actions';
import { ServerMessageCode } from '../wsMiddleware/messageTypes';
import { NotificationType } from '../notificationSlice/stateTypes';
import type { AppDispatch } from '../store';
import { PushTransientNotification } from '../notificationSlice';

const messageListenerMiddleware: Middleware = (
  { dispatch }: { dispatch: AppDispatch },
) => (next) => (action) => {
  if (messageReceived.match(action)) {
    const message = action.payload;

    if (message.code === ServerMessageCode.OpponentDisconnected) {
      dispatch(PushTransientNotification({
        type: NotificationType.Warning,
        message: 'The opponent has disconnected',
        timeoutArg: 5000,
      }));
    }
  }

  return next(action);
};

export default messageListenerMiddleware;
