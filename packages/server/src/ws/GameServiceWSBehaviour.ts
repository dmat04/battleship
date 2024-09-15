import { WebSocket, WebSocketBehavior } from "uWebSockets.js";
import SessionService, { WSAuthTicket } from "../services/SessionService.js";
import { WSState, type WSData } from "../services/models/WSData.js";
import { assertNever } from "@battleship/common/utils/typeUtils.js";
import MessageParser from "@battleship/common/messages/MessageParser.js";
import { ErrorMessage, ServerMessageCode } from "@battleship/common/messages/MessageTypes.js";
import GameService from "../services/GameService.js";

const messageDecoder = new TextDecoder();

const handleErrorState = (ws: WebSocket<WSData>): void => {
  let { errorMessage } = ws.getUserData();
  let code = 400;

  if (!errorMessage) {
    errorMessage = "Unknown error";
    code = 500;
  }

  const response: ErrorMessage = {
    code: ServerMessageCode.Error,
    message: errorMessage,
  };

  ws.send(JSON.stringify(response));
  ws.end(code);
};

const handleAuthMessage = (
  ws: WebSocket<WSData>,
  message: ArrayBuffer,
): void => {
  // decode the access code from raw data
  const decoded = messageDecoder.decode(message);
  // get the ws UserData
  const wsData = ws.getUserData();

  let errorMessage = null;
  let ticket: WSAuthTicket | false = false;

  if (wsData.state !== WSState.Unauthenticated) {
    errorMessage = "Authentication failed - ws connection in wrong state";
  }

  try {
    // try to decode the access code
    ticket = SessionService.decodeWSToken(decoded);
  } catch {
    errorMessage = "Authentication failed - invalid token";
  }

  // check that the decoded ticket data corresponds to the websocket data
  if (
    !ticket ||
    ticket.roomID !== wsData.roomID ||
    ticket.userID !== wsData.userID
  ) {
    errorMessage = "Authentication failed - invalid ticket";
  }

  // if the ticket is valid, and its data corresponds to the websocket
  if (ticket && errorMessage === null) {
    try {
      // let the GameService know that the socket is authenticated
      GameService.clientSocketAuthenticated(ticket.roomID, ticket.userID, ws);

      // set the socket state
      wsData.state = WSState.Open;
    } catch (error) {
      errorMessage =
        (error as Error).message ?? "Couldn't authenticate socket connection";
    }
  }

  // if any kind of error was encountered
  if (errorMessage) {
    // set the websocket into an error state, and handle the error state
    wsData.state = WSState.Error;
    wsData.errorMessage = errorMessage;
    handleErrorState(ws);
  }
};

const handleMessage = (ws: WebSocket<WSData>, message: ArrayBuffer): void => {
  const { roomID, userID } = ws.getUserData();
  const decoded = messageDecoder.decode(message);
  const parsedMessage = MessageParser.ParseClientMessage(decoded);

  if (!parsedMessage) {
    const response: ErrorMessage = {
      code: ServerMessageCode.Error,
      message: "Couldn't parse incoming message",
    };
    ws.send(JSON.stringify(response));
    return;
  }

  GameService.handleClientMessage(roomID, userID, parsedMessage);
};

/**
 * The WebsocketBehaviour used to instantiate uWebSockets.js websocket instances.
 */
const WsHandler: WebSocketBehavior<WSData> = {
  upgrade: (res, req, context) => {
    // this WebSocketBehaviour should be registered for routes matching the
    // pattern '/game/:gameId/:userId', so the two parameters are read from
    // the request
    const roomID = req.getParameter(0);
    const userID = req.getParameter(1);

    // do some checks before upgrading the request to websockets
    let errorMessage: string | null = null;
    try {
      GameService.clientSocketRequested(userID, roomID);
    } catch (error) {
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage =
          "Unkown error occured when attempting to open a websocket";
      }
    }

    // initialize an instance of user data for the new socket
    // the gameId, userId, and opponentWs are saved per socket
    // at this point, opponentWS might be undefined (if the opponent hasn't opened
    // a ws yet)
    const socketData: WSData = {
      state: WSState.Error,
      roomID,
      userID,
    };

    if (errorMessage) {
      // if an error has been found save the error in the sockets userData,
      // so it can be sent to the client after the ws connection is opened,
      socketData.state = WSState.Error;
      socketData.errorMessage = errorMessage;
    } else {
      // if no errors have been found, set the socket state to Unauthenticated
      socketData.state = WSState.Unauthenticated;
    }

    // Upgrade the connection and pass the created WSData as the userData parameter
    // for the websocket instance
    res.upgrade(
      socketData,
      req.getHeader("sec-websocket-key"),
      req.getHeader("sec-websocket-protocol"),
      req.getHeader("sec-websocket-extensions"),
      context,
    );
  },

  open: (ws) => {
    // on connection open, check if the ws user data is in an
    // error state, and if so, handle the error state (meaning send the
    // error message and close the connection)
    if (ws.getUserData().state === WSState.Error) {
      handleErrorState(ws);
    }
  },

  close: (ws) => {
    const data = ws.getUserData();
    GameService.clientSocketClosed(data.roomID, data.userID);
  },

  message: (ws, message) => {
    const wsData = ws.getUserData();

    // handle the message according to the ws state saved is UserData
    switch (wsData.state) {
      case WSState.Error:
        handleErrorState(ws);
        break;
      case WSState.Unauthenticated:
        handleAuthMessage(ws, message);
        break;
      case WSState.Open:
        handleMessage(ws, message);
        break;
      default:
        assertNever(wsData.state);
    }
  },
};

export default WsHandler;
