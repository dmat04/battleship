import { Action, Middleware } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store';
import { initGame, messageReceived } from '../activeGameSlice';

const onOpenBuilder = (authCode: string, socket: WebSocket) => (event: Event) => {
  console.log('socket opened', event);
  socket.send(authCode);
};

const onMessageBuilder = (dispatch: AppDispatch) => (event: MessageEvent) => {
  const message = JSON.parse(event.data);
  // TODO: check if code is AuthenticatedResponse and skip dispatch if so
  // TODO: create a messageParser

  dispatch(messageReceived(message));
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
    const { type } = action as Action;
    if (!type) return next(action);

    if (type === initGame.type) {
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

      return next(action);
    }

    return next(action);
  };
};

export default wsMiddleware;
