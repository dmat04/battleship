import _ from "lodash";
import { assertNever } from "../utils/typeUtils.js";
import * as MessageTypes from "./MessageTypes.js";
import {
  Coordinate,
  GameRoomStatus,
  PlacedShip,
  Ship,
  ShipClassName,
  ShipOrientation,
  Player,
} from "../types/__generated__/types.generated.js";

const isCoordinate = (obj: object): obj is Coordinate => {
  const typed = obj as Coordinate;

  return _.isInteger(typed.x) && _.isInteger(typed.y);
};

const isShootMessage = (
  message: object,
): message is MessageTypes.ShootMessage => {
  const typed = message as MessageTypes.ShootMessage;

  if (!isCoordinate(typed.position)) {
    return false;
  }

  if (!typed.code || typed.code !== MessageTypes.ClientMessageCode.Shoot) {
    return false;
  }

  return true;
};

const isErrorMessage = (
  message: object,
): message is MessageTypes.ErrorMessage => {
  const typed = message as MessageTypes.ErrorMessage;
  return (
    typed.code === MessageTypes.ServerMessageCode.Error &&
    _.isString(typed.message)
  );
};

const isShip = (obj: object): obj is Ship => {
  const typed = obj as Ship;

  if (!_.isString(typed.shipID)) {
    return false;
  }

  if (!_.isInteger(typed.size)) {
    return false;
  }

  if (!Object.values(ShipClassName).includes(typed.type)) {
    return false;
  }

  return true;
};

const isPlacedShip = (obj: object): obj is PlacedShip => {
  const typed = obj as PlacedShip;

  if (!isCoordinate(typed.position)) {
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

const isPlayer = (obj: object): obj is Player => {
  const { id, username } = obj as Player;

  return _.isString(id) && _.isString(username);
};

const isGameRoomStatus = (obj: object): obj is GameRoomStatus => {
  const {
    player,
    playerShipsPlaced,
    playerSocketConnected,
    opponent,
    opponentShipsPlaced,
    opponentSocketConnected,
    currentPlayerID,
  } = obj as GameRoomStatus;

  if (currentPlayerID && !_.isString(currentPlayerID)) return false;
  if (opponent && !isPlayer(opponent)) return false;

  if (
    !isPlayer(player) ||
    !_.isBoolean(playerShipsPlaced) ||
    !_.isBoolean(playerSocketConnected) ||
    !_.isBoolean(opponentShipsPlaced) ||
    !_.isBoolean(opponentSocketConnected)
  )
    return false;

  return true;
};

const isMoveResultMessage = (
  message: object,
): message is MessageTypes.MoveResultMessageBase => {
  const typed = message as MessageTypes.MoveResultMessageBase;

  if (!isCoordinate(typed.position)) return false;
  if (!_.isBoolean(typed.hit) || !_.isBoolean(typed.gameWon)) return false;
  if (!_.isString(typed.currentPlayerID)) return false;

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
  const { code, roomStatus } =
    message as MessageTypes.RoomStatusResponseMessage;

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
  const { code, playsFirstID } = message as MessageTypes.GameStartedMessage;

  return (
    code === MessageTypes.ServerMessageCode.GameStarted &&
    _.isString(playsFirstID)
  );
};

const isOpponentDisconectedMessage = (
  message: object,
): message is MessageTypes.OpponentDisconnectedMessage => {
  const { code } = message as MessageTypes.OpponentDisconnectedMessage;

  return code === MessageTypes.ServerMessageCode.OpponentDisconnected;
};

const ParseClientMessage = (
  jsonMessage: unknown,
): MessageTypes.ClientMessage | undefined => {
  if (!_.isString(jsonMessage)) return undefined;

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

  if (
    !Object.values(MessageTypes.ClientMessageCode).includes(
      message.code as MessageTypes.ClientMessageCode,
    )
  ) {
    return undefined;
  }

  const code: MessageTypes.ClientMessageCode =
    message.code as MessageTypes.ClientMessageCode;

  switch (code) {
    case MessageTypes.ClientMessageCode.Shoot:
      return isShootMessage(message) ? message : undefined;
    case MessageTypes.ClientMessageCode.RoomStatusRequest:
      return { code };
    default:
      return assertNever(code);
  }
};

const ParseServerMessage = (
  jsonMessage: unknown,
): MessageTypes.ServerMessage | undefined => {
  if (!_.isString(jsonMessage)) return undefined;

  let message: unknown = null;

  try {
    message = JSON.parse(jsonMessage);
  } catch {
    return undefined;
  }

  if (!_.isObject(message)) {
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
