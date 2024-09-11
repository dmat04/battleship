import { Middleware } from "@reduxjs/toolkit";
import { messageReceived } from "../wsMiddleware/actions.js";
import { ServerMessageCode } from "@battleship/common/messages/MessageTypes.js";
import { NotificationType } from "../notificationSlice/stateTypes.js";
import type { AppDispatch, RootState } from "../store.js";
import { PushTransientNotification } from "../notificationSlice/index.js";
import { assertNever } from "@battleship/common/utils/typeUtils.js";

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
          const { player, opponent } = state.gameRoom;
          const { playsFirstID } = message;
          const notification =
            playsFirstID === player?.id
              ? "Game started - make the first move"
              : `Game started - ${opponent?.username ?? 'the opponent'} makes the first move`;

          void dispatch(
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
            void dispatch(
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
