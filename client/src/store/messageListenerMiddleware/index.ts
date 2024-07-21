import { Middleware } from "@reduxjs/toolkit";
import { messageReceived } from "../wsMiddleware/actions";
import { ServerMessageCode } from "../wsMiddleware/messageTypes";
import { NotificationType } from "../notificationSlice/stateTypes";
import type { AppDispatch, RootState } from "../store";
import { PushTransientNotification } from "../notificationSlice";
import { assertNever } from "../../utils/typeUtils";

const messageListenerMiddleware: Middleware =
  ({
    dispatch,
    getState,
  }: {
    dispatch: AppDispatch;
    getState: () => RootState;
  }) =>
  (next) =>
  (action) => {
    if (messageReceived.match(action)) {
      const message = action.payload;
      const { code } = message;
      const state = getState();

      switch (code) {
        case ServerMessageCode.Error:
          break;
        case ServerMessageCode.OpponentMoveResult:
          break;
        case ServerMessageCode.OwnMoveResult:
          break;
        case ServerMessageCode.RoomStatusResponse:
          break;
        case ServerMessageCode.AuthenticatedResponse:
          break;
        case ServerMessageCode.GameStarted: {
          const { playerName } = state.gameRoom;
          const { playsFirst } = message;
          const notification =
            playsFirst === playerName
              ? "Game started - make the first move"
              : `Game started - ${playsFirst} makes the first move`;

          dispatch(
            PushTransientNotification({
              type: NotificationType.Info,
              message: notification,
              timeoutArg: 5000,
            }),
          );
          break;
        }
        case ServerMessageCode.OpponentDisconnected:
          if (!state.gameRoom.gameStarted) {
            dispatch(
              PushTransientNotification({
                type: NotificationType.Warning,
                message: "The opponent has disconnected",
                timeoutArg: 5000,
              }),
            );
          }
          break;
        default:
          assertNever(code);
      }
    }

    return next(action);
  };

export default messageListenerMiddleware;
