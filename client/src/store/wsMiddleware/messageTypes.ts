import { PlacedShip, GameRoomStatus } from "../../__generated__/graphql";

export interface CellHitResult {
  x: number;
  y: number;
  hit: boolean;
  gameWon: boolean;
  shipSunk?: PlacedShip;
}

export enum ClientMessageCode {
  Shoot = "Shoot",
  RoomStatusRequest = "RoomStatusRequest",
}

export enum ServerMessageCode {
  Error = "Error",
  OpponentMoveResult = "OpponentMoveResult",
  OwnMoveResult = "OwnMoveResult",
  RoomStatusResponse = "RoomStatusResponse",
  AuthenticatedResponse = "AuthenticatedResponse",
  GameStarted = "GameStarted",
  OpponentDisconnected = "OpponentDisconnected",
}

export interface ShootMessage {
  code: ClientMessageCode.Shoot;
  x: number;
  y: number;
}

export interface RoomStatusRequestMessage {
  code: ClientMessageCode.RoomStatusRequest;
}

export interface ErrorMessage {
  code: ServerMessageCode.Error;
  message: string;
}

export interface MoveResultMessageBase extends CellHitResult {
  currentPlayer: string;
}

export interface OpponentMoveResultMessage extends MoveResultMessageBase {
  code: ServerMessageCode.OpponentMoveResult;
}

export interface OwnMoveResultMessage extends MoveResultMessageBase {
  code: ServerMessageCode.OwnMoveResult;
}

export interface RoomStatusResponseMessage {
  code: ServerMessageCode.RoomStatusResponse;
  roomStatus: GameRoomStatus;
}

export interface AuthenticatedResponseMessage {
  code: ServerMessageCode.AuthenticatedResponse;
}

export interface GameStartedMessage {
  code: ServerMessageCode.GameStarted;
  playsFirst: string;
}

export interface OpponentDisconnectedMessage {
  code: ServerMessageCode.OpponentDisconnected;
}

export type ClientMessage = ShootMessage | RoomStatusRequestMessage;

export type ServerMessage =
  | ErrorMessage
  | OpponentMoveResultMessage
  | OwnMoveResultMessage
  | RoomStatusResponseMessage
  | AuthenticatedResponseMessage
  | GameStartedMessage
  | OpponentDisconnectedMessage;
