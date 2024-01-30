import { MoveResult } from '../game/Board';
import { GameRoomStatus } from '../graphql/types.generated';

export enum ClientMessageCode {
  Shoot = 'Shoot',
  RoomStatusRequest = 'RoomStatusRequest',
}

export enum ServerMessageCode {
  Error = 'Error',
  OpponentMoveResult = 'OpponentMoveResult',
  OwnMoveResult = 'OwnMoveResult',
  RoomStatusResponse = 'RoomStatusResponse',
  AuthenticatedResponse = 'AuthenticatedResponse',
  GameStarted = 'GameStarted',
}

export interface CoordinateMessage {
  x: number;
  y: number;
}

interface MoveResultMessage extends CoordinateMessage {
  result: MoveResult;
  currentPlayer: string;
}

export interface ShootMessage extends CoordinateMessage {
  code: ClientMessageCode.Shoot;
}

export interface RoomStatusRequestMessage {
  code: ClientMessageCode.RoomStatusRequest;
}

export interface ErrorMessage {
  code: ServerMessageCode.Error;
  message: string;
}

export interface OpponentMoveResultMessage extends MoveResultMessage {
  code: ServerMessageCode.OpponentMoveResult;
}

export interface OwnMoveResultMessage extends MoveResultMessage {
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

export type ClientMessage =
  | ShootMessage
  | RoomStatusRequestMessage;

export type ServerMessage =
 | ErrorMessage
 | OpponentMoveResultMessage
 | OwnMoveResultMessage
 | RoomStatusResponseMessage
 | AuthenticatedResponseMessage
 | GameStartedMessage;
