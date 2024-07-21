import { isBoolean, isInteger } from "lodash";
import { assertNever, isObject, isString } from "../../utils/typeUtils";
import {
  AuthenticatedResponseMessage,
  ErrorMessage,
  GameStartedMessage,
  MoveResultMessageBase,
  OpponentDisconnectedMessage,
  OpponentMoveResultMessage,
  OwnMoveResultMessage,
  RoomStatusResponseMessage,
  ServerMessage,
  ServerMessageCode,
} from "./messageTypes";
import {
  GameRoomStatus,
  PlacedShip,
  Ship,
  ShipClassName,
  ShipOrientation,
} from "../../__generated__/graphql";

const isErrorMessage = (message: object): message is ErrorMessage => {
  const typed = message as ErrorMessage;
  return typed.code === ServerMessageCode.Error && isString(typed.message);
};

const isShip = (obj: Object): obj is Ship => {
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
): message is MoveResultMessageBase => {
  const typed = message as MoveResultMessageBase;

  if (!isInteger(typed.x) || !isInteger(typed.y)) return false;
  if (!isBoolean(typed.hit) || !isBoolean(typed.gameWon)) return false;
  if (!isString(typed.currentPlayer)) return false;

  const { shipSunk } = typed;
  if (shipSunk !== undefined && !isPlacedShip(shipSunk)) return false;

  return true;
};

const isOpponentMoveResultMessage = (
  message: object,
): message is OpponentMoveResultMessage =>
  "code" in message &&
  message.code === ServerMessageCode.OpponentMoveResult &&
  isMoveResultMessage(message);

const isOwnMoveResultMessage = (
  message: object,
): message is OwnMoveResultMessage =>
  "code" in message &&
  message.code === ServerMessageCode.OwnMoveResult &&
  isMoveResultMessage(message);

const isRoomStatusResponseMessage = (
  message: object,
): message is RoomStatusResponseMessage => {
  const { code, roomStatus } = message as RoomStatusResponseMessage;

  return (
    code === ServerMessageCode.RoomStatusResponse &&
    isGameRoomStatus(roomStatus)
  );
};

const isAuthenticatedResponseMessage = (
  message: object,
): message is AuthenticatedResponseMessage => {
  const { code } = message as AuthenticatedResponseMessage;

  return code === ServerMessageCode.AuthenticatedResponse;
};

const isGameStartedMessage = (
  message: object,
): message is GameStartedMessage => {
  const { code, playsFirst } = message as GameStartedMessage;

  return code === ServerMessageCode.GameStarted && isString(playsFirst);
};

const isOpponentDisconectedMessage = (
  message: object,
): message is OpponentDisconnectedMessage => {
  const { code } = message as OpponentDisconnectedMessage;

  return code === ServerMessageCode.OpponentDisconnected;
};

const parseMessage = (jsonMessage: string): ServerMessage | undefined => {
  let message = null;

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

  const code = message.code as ServerMessageCode;

  if (!Object.values(ServerMessageCode).includes(code)) {
    return undefined;
  }

  switch (code) {
    case ServerMessageCode.Error:
      return isErrorMessage(message) ? message : undefined;
    case ServerMessageCode.OpponentMoveResult:
      return isOpponentMoveResultMessage(message) ? message : undefined;
    case ServerMessageCode.OwnMoveResult:
      return isOwnMoveResultMessage(message) ? message : undefined;
    case ServerMessageCode.RoomStatusResponse:
      return isRoomStatusResponseMessage(message) ? message : undefined;
    case ServerMessageCode.AuthenticatedResponse:
      return isAuthenticatedResponseMessage(message) ? message : undefined;
    case ServerMessageCode.GameStarted:
      return isGameStartedMessage(message) ? message : undefined;
    case ServerMessageCode.OpponentDisconnected:
      return isOpponentDisconectedMessage(message) ? message : undefined;
    default:
      return assertNever(code);
  }
};

export default {
  parseMessage,
};
