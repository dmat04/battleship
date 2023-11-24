import { WebSocket, WebSocketBehavior } from 'uWebSockets.js';
import AuthService from '../services/AuthService';
import { WSState, type WSData } from '../models/WSData';
import { assertNever } from '../utils/typeUtils';
import GameService from '../services/GameService';

const messageDecoder = new TextDecoder();

const handleErrorState = (ws: WebSocket<WSData>): void => {
  let { errorMessage } = ws.getUserData();
  let code = 400;

  if (!errorMessage) {
    errorMessage = 'Unknown error';
    code = 500;
  }

  ws.send(JSON.stringify({ error: errorMessage }));
  ws.end(code);
};

const handleAuthMessage = (ws: WebSocket<WSData>, message: ArrayBuffer): void => {
  // decode the access code from raw data
  const decoded = messageDecoder.decode(message);
  // get the ws UserData
  const wsData = ws.getUserData();
  let errorMessage;

  if (wsData.state !== WSState.Unauthenticated) {
    errorMessage = 'Authentication failed - ws connection in wrong state';
  } else {
    try {
      // try to decode the access code
      const ticket = AuthService.decodeWSToken(decoded);
      if (ticket
        && ticket.gameID === wsData.gameID
        && ticket.username === wsData.username) {
        const opponentWS = GameService.playerSocketAuthenticated(
          ticket.gameID,
          ticket.username,
          ws,
        );
        wsData.state = WSState.Open;
        wsData.opponentWS = opponentWS;

        if (opponentWS) {
          opponentWS.getUserData().opponentWS = ws;
        }

        ws.send('Auth OK');
      } else {
        errorMessage = 'Authentication failed - invalid ticket';
      }
    } catch {
      errorMessage = 'Authentication failed - invalid token';
    }
  }

  if (errorMessage) {
    wsData.state = WSState.Error;
    wsData.errorMessage = errorMessage;
    handleErrorState(ws);
  }
};

const handleMessage = (ws: WebSocket<WSData>, message: ArrayBuffer): void => {
  const wsData = ws.getUserData();
  const decoded = messageDecoder.decode(message);
  // for now just pass on the message, not really processing it yet
  if (wsData.opponentWS) {
    wsData.opponentWS.send(`Message from ${wsData.username}: '${decoded}'`);
  } else {
    ws.send('Message received, opponent not connected yet');
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
    let opponentWS: WebSocket<WSData> | null = null;
    try {
      opponentWS = GameService.playerSocketRequested(username, gameID);
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
      gameID,
      username,
      opponentWS,
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
