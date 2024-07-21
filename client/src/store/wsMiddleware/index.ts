import { Middleware } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import MessageParser from "./MessageParser";
import {
  ClientMessageCode,
  RoomStatusRequestMessage,
  ServerMessageCode,
} from "./messageTypes";
import {
  closeWSConnection,
  connectionOpened,
  messageReceived,
  openWSConnection,
  sendMessage,
} from "./actions";

interface ClientSocket {
  instance: WebSocket;
  authenticated: boolean;
}

const onOpenBuilder = (authCode: string, socket: ClientSocket) => () => {
  socket.instance.send(authCode);

  const message: RoomStatusRequestMessage = {
    code: ClientMessageCode.RoomStatusRequest,
  };

  socket.instance.send(JSON.stringify(message));
};

const onMessageBuilder =
  (dispatch: AppDispatch, socket: ClientSocket) => (event: MessageEvent) => {
    const message = MessageParser.parseMessage(event.data);

    if (message) {
      if (message.code === ServerMessageCode.AuthenticatedResponse) {
        // eslint-disable-next-line no-param-reassign
        socket.authenticated = true;
        dispatch(connectionOpened());
      } else {
        dispatch(messageReceived(message));
      }
    } else {
      // TODO: dispatch an error
    }
  };

const onError = (event: Event) => {
  console.log("socket error", event);
};

const onCLose = (event: CloseEvent) => {
  console.log("socket closed", event.reason);
};

const createSocket = (
  url: string,
  authCode: string,
  dispatch: AppDispatch,
): ClientSocket => {
  const socket: ClientSocket = {
    instance: new WebSocket(url),
    authenticated: false,
  };

  socket.instance.onopen = onOpenBuilder(authCode, socket);
  socket.instance.onmessage = onMessageBuilder(dispatch, socket);
  socket.instance.onerror = onError;
  socket.instance.onclose = onCLose;

  return socket;
};

const wsMiddleware: Middleware = ({ dispatch, getState }) => {
  let socket: ClientSocket | null = null;

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
      if (!socket) {
        // TODO: dispatch error - socket not opened
        return next(action);
      }

      if (!socket.authenticated) {
        // TODO: dispatch error - socket not authenticated
        return next(action);
      }

      const { payload } = action;
      socket.instance.send(JSON.stringify(payload));
    } else if (closeWSConnection.match(action)) {
      if (socket !== null) {
        socket.instance.close();
        socket = null;
      }
    }

    return next(action);
  };
};

export default wsMiddleware;
