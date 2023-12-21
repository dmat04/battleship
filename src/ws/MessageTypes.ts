import { MoveResult } from '../game/types';
import { GameRoomStatus } from '../models/GameRoom';

export enum IncomingMessageCode {
  Shoot = 'Shoot',
  RoomStatusRequest = 'RoomStatusRequest',
}

export enum OutgoingMessageCode {
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
  code: IncomingMessageCode.Shoot;
}

export interface RoomStatusRequestMessage {
  code: IncomingMessageCode.RoomStatusRequest;
}

export interface ErrorMessage {
  code: OutgoingMessageCode.Error;
  message: string;
}

export interface OpponentMoveResultMessage extends MoveResultMessage {
  code: OutgoingMessageCode.OpponentMoveResult;
}

export interface OwnMoveResultMessage extends MoveResultMessage {
  code: OutgoingMessageCode.OwnMoveResult;
}

export interface RoomStatusResponseMessage {
  code: OutgoingMessageCode.RoomStatusResponse;
  roomStatus: GameRoomStatus;
}

export interface AuthenticatedResponseMessage {
  code: OutgoingMessageCode.AuthenticatedResponse;
}

export interface GameStartedMessage {
  code: OutgoingMessageCode.GameStarted;
  playsFirst: string;
}

export type IncommingMessage =
  | ShootMessage
  | RoomStatusRequestMessage;

export type OutgoingMessage =
 | ErrorMessage
 | OpponentMoveResultMessage
 | OwnMoveResultMessage
 | RoomStatusResponseMessage
 | AuthenticatedResponseMessage
 | GameStartedMessage;
