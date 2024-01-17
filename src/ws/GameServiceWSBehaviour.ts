import { WebSocket, WebSocketBehavior } from 'uWebSockets.js';
import AuthService, { WSAuthTicket } from '../services/AuthService';
import { WSState, type WSData } from '../models/WSData';
import { assertNever } from '../utils/typeUtils';
import MessageParser from './MessageParser';
import {
  AuthenticatedResponseMessage,
  ErrorMessage,
  ClientMessageCode,
  OpponentMoveResultMessage,
  ServerMessageCode,
  OwnMoveResultMessage,
  RoomStatusResponseMessage,
  ShootMessage,
} from './MessageTypes';
import GameRoomService from '../services/GameRoomService';
import ActiveGameService from '../services/ActiveGameService';
import GameplayError from '../game/GameplayError';

const messageDecoder = new TextDecoder();

const handleErrorState = (ws: WebSocket<WSData>): void => {
  let { errorMessage } = ws.getUserData();
  let code = 400;

  if (!errorMessage) {
    errorMessage = 'Unknown error';
    code = 500;
  }

  const response: ErrorMessage = {
    code: ServerMessageCode.Error,
    message: errorMessage,
  };

  ws.send(JSON.stringify(response));
  ws.end(code);
};

const handleAuthMessage = (ws: WebSocket<WSData>, message: ArrayBuffer): void => {
  // decode the access code from raw data
  const decoded = messageDecoder.decode(message);
  // get the ws UserData
  const wsData = ws.getUserData();

  let errorMessage = null;
  let ticket: WSAuthTicket | false = false;

  if (wsData.state !== WSState.Unauthenticated) {
    errorMessage = 'Authentication failed - ws connection in wrong state';
  }

  try {
    // try to decode the access code
    ticket = AuthService.decodeWSToken(decoded);
  } catch {
    errorMessage = 'Authentication failed - invalid token';
  }

  // check that the decoded ticket data corresponds to the websocket data
  if (
    !ticket
    || ticket.roomID !== wsData.roomID
    || ticket.username !== wsData.username
  ) {
    errorMessage = 'Authentication failed - invalid ticket';
  }

  // if the ticket is valid, and its data corresponds to the websocket
  if (ticket && errorMessage === null) {
    // let the GameService know that the socket is authenticated
    GameRoomService.playerSocketAuthenticated(ticket.roomID, ticket.username, ws);
    // set the socket state
    wsData.state = WSState.Open;

    // send a confirmation message
    const responseMessage: AuthenticatedResponseMessage = {
      code: ServerMessageCode.AuthenticatedResponse,
    };

    ws.send(JSON.stringify(responseMessage));
  }

  // if any kind of error was encountered
  if (errorMessage) {
    // set the websocket into an error state, and handle the error state
    wsData.state = WSState.Error;
    wsData.errorMessage = errorMessage;
    handleErrorState(ws);
  }
};

const handleShootMessage = (ws: WebSocket<WSData>, message: ShootMessage): void => {
  const { roomIsActive, roomID, username } = ws.getUserData();

  if (!roomIsActive) {
    const response: ErrorMessage = {
      code: ServerMessageCode.Error,
      message: 'Can\'t make move, game is not active.',
    };

    ws.send(JSON.stringify(response));
    return;
  }

  try {
    const { x, y } = message;
    const {
      result,
      currentPlayer,
      opponentWS,
    } = ActiveGameService.makeMove(roomID, username, x, y);

    const ownResponse: OwnMoveResultMessage = {
      code: ServerMessageCode.OwnMoveResult,
      x,
      y,
      result,
      currentPlayer,
    };

    const opponentResponse: OpponentMoveResultMessage = {
      code: ServerMessageCode.OpponentMoveResult,
      x,
      y,
      result,
      currentPlayer,
    };

    ws.send(JSON.stringify(ownResponse));
    opponentWS.send(JSON.stringify(opponentResponse));
  } catch (error) {
    if (error instanceof GameplayError) {
      const response: ErrorMessage = {
        code: ServerMessageCode.Error,
        message: error.message,
      };

      ws.send(JSON.stringify(response));
    } else {
      let errorMessage = 'An unknown error has occured';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      const wsData = ws.getUserData();
      wsData.errorMessage = errorMessage;
      wsData.state = WSState.Error;
      handleErrorState(ws);
    }
  }
};

const handleRoomStatusRequestMessage = (ws: WebSocket<WSData>) => {
  const wsData = ws.getUserData();

  let roomStatus = null;

  try {
    if (wsData.roomIsActive) {
      roomStatus = ActiveGameService.getRoomStatus(wsData.roomID);
    } else {
      roomStatus = GameRoomService.getRoomStatus(wsData.roomID);
    }
  } catch { /* empty */ }

  if (roomStatus) {
    const response: RoomStatusResponseMessage = {
      code: ServerMessageCode.RoomStatusResponse,
      roomStatus,
    };

    ws.send(JSON.stringify(response));
  } else {
    wsData.state = WSState.Error;
    wsData.errorMessage = `GameRoom service error: room ${wsData.roomID} not found.`;
    handleErrorState(ws);
  }
};

const handleMessage = (ws: WebSocket<WSData>, message: ArrayBuffer): void => {
  const decoded = messageDecoder.decode(message);
  const parsedMessage = MessageParser.ParseMessage(decoded);

  if (!parsedMessage) {
    const response: ErrorMessage = {
      code: ServerMessageCode.Error,
      message: 'Couldn\'t parse incoming message',
    };
    ws.send(JSON.stringify(response));
    return;
  }

  const { code } = parsedMessage;
  switch (code) {
    case ClientMessageCode.Shoot: handleShootMessage(ws, parsedMessage); break;
    case ClientMessageCode.RoomStatusRequest: handleRoomStatusRequestMessage(ws); break;
    default: assertNever(code);
  }
};

/**
 * The WebsocketBehaviour used to instantiate uWebSockets.js websocket instances.
 */
const WsHandler: WebSocketBehavior<WSData> = {
  upgrade: (res, req, context) => {
    // this WebSocketBehaviour should be registered for routes matching the
    // pattern '/game/:gameId/:username', so the two parameters are read from
    // the request
    const gameID = req.getParameter(0);
    const username = req.getParameter(1);

    // do some checks before upgrading the request to websockets
    let errorMessage: string | null = null;
    try {
      GameRoomService.playerSocketRequested(username, gameID);
    } catch (error) {
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Unkown error occured when attempting to open a websocket';
      }
    }

    // initialize an instance of user data for the new socket
    // the gameId, username, and opponentWs are saved per socket
    // at this point, opponentWS might be undefined (if the opponent hasn't opened
    // a ws yet)
    const socketData: WSData = {
      state: WSState.Error,
      roomID: gameID,
      roomIsActive: false,
      username,
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
      req.getHeader('sec-websocket-key'),
      req.getHeader('sec-websocket-protocol'),
      req.getHeader('sec-websocket-extensions'),
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
