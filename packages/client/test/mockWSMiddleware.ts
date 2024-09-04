import { Middleware } from "@reduxjs/toolkit";
import MessageParser from "@battleship/common/messages/MessageParser.js";
import {
  closeWSConnection,
  connectionOpened,
  messageReceived,
  sendMessage,
} from "../src/store/wsMiddleware/actions.js";
import { AppDispatch, RootState } from "../src/store/store.js";

const openSocket = ({ gameRoom }: RootState, dispatch: AppDispatch): WebSocket => {
  const url = `${process.env.WS_URL}/game/${gameRoom.roomID}/${gameRoom.playerName}`;

  const socket = new WebSocket(url);

  socket.onopen = () => dispatch(connectionOpened());

  socket.onmessage = (event: MessageEvent) => {
    const message = MessageParser.ParseServerMessage(event.data);

    if (message) {
      dispatch(messageReceived(message));
    }
  };

  return socket;
};

const mockWSMiddleware: Middleware = ({
  dispatch,
  getState,
}: {
  dispatch: AppDispatch;
  getState: () => RootState;
}) => {
  const socket = openSocket(getState(), dispatch);

  return (next) => (action) => {
    if (sendMessage.match(action)) {
      const { payload } = action;
      socket.send(JSON.stringify(payload));
    } else if (closeWSConnection.match(action)) {
      if (socket !== null) {
        socket.close();
      }
    }

    return next(action);
  };
};

export default mockWSMiddleware;
