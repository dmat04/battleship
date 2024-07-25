import { isBoolean, isInteger, isObject, isString } from "lodash";
import { assertNever } from "../utils/typeUtils.js";
import * as MessageTypes from "./MessageTypes.js";
import { GameRoomStatus, PlacedShip, Ship, ShipClassName, ShipOrientation } from "../types/__generated__/types.generated.js";

const isShootMessage = (message: object): message is MessageTypes.ShootMessage => {
  const typed = message as MessageTypes.ShootMessage;

  if (!isInteger(typed.x) || !isInteger(typed.y)) {
    return false;
  }

  if (!typed.code || typed.code !== MessageTypes.ClientMessageCode.Shoot) {
    return false;
  }

  return true;
};

const isErrorMessage = (message: object): message is MessageTypes.ErrorMessage => {
  const typed = message as MessageTypes.ErrorMessage;
  return typed.code === MessageTypes.ServerMessageCode.Error && isString(typed.message);
};

const isShip = (obj: object): obj is Ship => {
  const typed = obj as Ship;

  if (!isString(typed.shipID)) {
    return false;
  }

  if (!isInteger(typed.size)) {
    return false;
  }

  if (!Object.values(ShipClassName).includes(typed.type)) {
    return false;
  }

  return true;
};

const isPlacedShip = (obj: object): obj is PlacedShip => {
  const typed = obj as PlacedShip;

  if (!isInteger(typed.x) || !isInteger(typed.y)) {
    return false;
  }

  if (!Object.values(ShipOrientation).includes(typed.orientation)) {
    return false;
  }

  if (!isShip(typed.ship)) {
    return false;
  }

  return true;
};

const isGameRoomStatus = (obj: object): obj is GameRoomStatus => {
  const {
    currentPlayer,
    opponent,
    opponentShipsPlaced,
    opponentSocketConnected,
    player,
    playerShipsPlaced,
    playerSocketConnected,
  } = obj as GameRoomStatus;

  if (currentPlayer && !isString(currentPlayer)) return false;
  if (opponent && !isString(opponent)) return false;

  if (
    !isString(player) ||
    !isBoolean(playerShipsPlaced) ||
    !isBoolean(playerSocketConnected) ||
    !isBoolean(opponentShipsPlaced) ||
    !isBoolean(opponentSocketConnected)
  )
    return false;

  return true;
};

const isMoveResultMessage = (
  message: object,
): message is MessageTypes.MoveResultMessageBase => {
  const typed = message as MessageTypes.MoveResultMessageBase;

  if (!isInteger(typed.x) || !isInteger(typed.y)) return false;
  if (!isBoolean(typed.hit) || !isBoolean(typed.gameWon)) return false;
  if (!isString(typed.currentPlayer)) return false;

  const { shipSunk } = typed;
  if (shipSunk !== undefined && !isPlacedShip(shipSunk)) return false;

  return true;
};

const isOpponentMoveResultMessage = (
  message: object,
): message is MessageTypes.OpponentMoveResultMessage =>
  "code" in message &&
  message.code === MessageTypes.ServerMessageCode.OpponentMoveResult &&
  isMoveResultMessage(message);

const isOwnMoveResultMessage = (
  message: object,
): message is MessageTypes.OwnMoveResultMessage =>
  "code" in message &&
  message.code === MessageTypes.ServerMessageCode.OwnMoveResult &&
  isMoveResultMessage(message);

const isRoomStatusResponseMessage = (
  message: object,
): message is MessageTypes.RoomStatusResponseMessage => {
  const { code, roomStatus } = message as MessageTypes.RoomStatusResponseMessage;

  return (
    code === MessageTypes.ServerMessageCode.RoomStatusResponse &&
    isGameRoomStatus(roomStatus)
  );
};

const isAuthenticatedResponseMessage = (
  message: object,
): message is MessageTypes.AuthenticatedResponseMessage => {
  const { code } = message as MessageTypes.AuthenticatedResponseMessage;

  return code === MessageTypes.ServerMessageCode.AuthenticatedResponse;
};

const isGameStartedMessage = (
  message: object,
): message is MessageTypes.GameStartedMessage => {
  const { code, playsFirst } = message as MessageTypes.GameStartedMessage;

  return code === MessageTypes.ServerMessageCode.GameStarted && isString(playsFirst);
};

const isOpponentDisconectedMessage = (
  message: object,
): message is MessageTypes.OpponentDisconnectedMessage => {
  const { code } = message as MessageTypes.OpponentDisconnectedMessage;

  return code === MessageTypes.ServerMessageCode.OpponentDisconnected;
};

const ParseClientMessage = (jsonMessage: string): MessageTypes.ClientMessage | undefined => {
  let message: unknown = null;

  try {
    message = JSON.parse(jsonMessage);
  } catch {
    return undefined;
  }

  if (typeof message !== "object") {
    return undefined;
  }

  if (!message || !("code" in message)) {
    return undefined;
  }

  if (!Object.values(MessageTypes.ClientMessageCode).includes(message.code as MessageTypes.ClientMessageCode)) {
    return undefined;
  }

  const code: MessageTypes.ClientMessageCode = message.code as MessageTypes.ClientMessageCode;

  switch (code) {
    case MessageTypes.ClientMessageCode.Shoot:
      return isShootMessage(message) ? message : undefined;
    case MessageTypes.ClientMessageCode.RoomStatusRequest:
      return { code };
    default:
      return assertNever(code);
  }
};

const ParseServerMessage = (jsonMessage: string): MessageTypes.ServerMessage | undefined => {
  let message: unknown = null;

  try {
    message = JSON.parse(jsonMessage);
  } catch {
    return undefined;
  }

  if (!isObject(message)) {
    return undefined;
  }

  if (!("code" in message)) {
    return undefined;
  }

  const code = message.code as MessageTypes.ServerMessageCode;

  if (!Object.values(MessageTypes.ServerMessageCode).includes(code)) {
    return undefined;
  }

  switch (code) {
    case MessageTypes.ServerMessageCode.Error:
      return isErrorMessage(message) ? message : undefined;
    case MessageTypes.ServerMessageCode.OpponentMoveResult:
      return isOpponentMoveResultMessage(message) ? message : undefined;
    case MessageTypes.ServerMessageCode.OwnMoveResult:
      return isOwnMoveResultMessage(message) ? message : undefined;
    case MessageTypes.ServerMessageCode.RoomStatusResponse:
      return isRoomStatusResponseMessage(message) ? message : undefined;
    case MessageTypes.ServerMessageCode.AuthenticatedResponse:
      return isAuthenticatedResponseMessage(message) ? message : undefined;
    case MessageTypes.ServerMessageCode.GameStarted:
      return isGameStartedMessage(message) ? message : undefined;
    case MessageTypes.ServerMessageCode.OpponentDisconnected:
      return isOpponentDisconectedMessage(message) ? message : undefined;
    default:
      return assertNever(code);
  }
};

export default {
  ParseClientMessage,
  ParseServerMessage,
};
