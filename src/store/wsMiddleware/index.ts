import { Middleware } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store';
import MessageParser from './MessageParser';
import {
  ClientMessageCode,
  RoomStatusRequestMessage,
} from './messageTypes';
import {
  closeWSConnection,
  messageReceived,
  openWSConnection,
  sendMessage,
} from './actions';

const onOpenBuilder = (authCode: string, socket: WebSocket) => () => {
  socket.send(authCode);

  const message: RoomStatusRequestMessage = {
    code: ClientMessageCode.RoomStatusRequest,
  };

  socket?.send(JSON.stringify(message));
};

const onMessageBuilder = (dispatch: AppDispatch) => (event: MessageEvent) => {
  const message = MessageParser.parseMessage(event.data);

  if (message) {
    dispatch(messageReceived(message));
  } else {
    // TODO: dispatch an error
  }
};

const onError = (event: Event) => {
  console.log('socket error', event);
};

const onCLose = (event: CloseEvent) => {
  console.log('socket closed', event.reason);
};

const createSocket = (url: string, authCode: string, dispatch: AppDispatch): WebSocket => {
  const socket = new WebSocket(url);

  socket.onopen = onOpenBuilder(authCode, socket);
  socket.onmessage = onMessageBuilder(dispatch);
  socket.onerror = onError;
  socket.onclose = onCLose;

  return socket;
};

const wsMiddleware: Middleware = ({ dispatch, getState }) => {
  let socket: WebSocket | null = null;

  return (next) => (action) => {
    if (openWSConnection.match(action)) {
      if (socket !== null) {
        // TODO: dispatch an error
        return next(action);
      }

      const auth = getState().auth.loginResult;
      const username = auth?.username;
      if (!username) {
        // TODO: dispatch an error
        return next(action);
      }

      const { roomID, wsAuthCode } = action.payload;

      const uriEncodedUsername = encodeURIComponent(username);
      const url = `ws://localhost:5000/game/${roomID}/${uriEncodedUsername}`;
      socket = createSocket(url, wsAuthCode, dispatch);
    } else if (sendMessage.match(action)) {
      const { payload } = action;
      socket?.send(JSON.stringify(payload));
    } else if (closeWSConnection.match(action)) {
      if (socket !== null) {
        socket.close();
        socket = null;
      }
    }

    return next(action);
  };
};

export default wsMiddleware;
