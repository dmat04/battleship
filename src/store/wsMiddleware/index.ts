import { Middleware } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store';
import {
  hitOpponentCell,
  initGame,
  messageReceived,
  requestRoomStatus,
} from '../activeGameSlice';
import MessageParser from './MessageParser';
import {
  ClientMessageCode,
  RoomStatusRequestMessage,
  ShootMessage,
} from '../activeGameSlice/messageTypes';

const onOpenBuilder = (authCode: string, socket: WebSocket) => () => {
  socket.send(authCode);
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
    if (initGame.match(action)) {
      if (socket !== null) {
        // TODO: dispatch an error
        return next(action);
      }

      const state = getState();
      const username = state.auth.loginResult?.username;
      const { roomID, wsAuthCode } = state.gameRoom;

      if (username && roomID && wsAuthCode) {
        const uriEncodedUsername = encodeURIComponent(username);
        const url = `ws://localhost:5000/game/${roomID}/${uriEncodedUsername}`;
        socket = createSocket(url, wsAuthCode, dispatch);
      } else {
        // TODO: dispatch an error action
      }
    } else if (hitOpponentCell.match(action)) {
      const { payload } = action;

      const message: ShootMessage = {
        code: ClientMessageCode.Shoot,
        x: payload.x,
        y: payload.y,
      };

      socket?.send(JSON.stringify(message));
    } else if (requestRoomStatus.match(action)) {
      const message: RoomStatusRequestMessage = {
        code: ClientMessageCode.RoomStatusRequest,
      };

      socket?.send(JSON.stringify(message));
    }

    return next(action);
  };
};

export default wsMiddleware;
