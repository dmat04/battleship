export enum MessageCode {
  Shoot = 'Shoot',
  Hit = 'Hit',
  Miss = 'Miss',
  Error = 'Error',
  WaitingForOpponent = 'WaitingForOpponent',
  OpponentConnected = 'OpponentConnected',
  OpponentReady = 'OpponentReady',
  GameStarted = 'GameStarted',
}

export interface CoordinateMessage {
  x: number;
  y: number;
}

export interface ShootMessage extends CoordinateMessage {
  code: MessageCode.Shoot;
}

export interface HitMessage extends CoordinateMessage {
  code: MessageCode.Hit;
}

export interface MissMessage extends CoordinateMessage {
  code: MessageCode.Miss;
}

export interface ErrorMessage {
  code: MessageCode.Error;
  message: string;
}

export interface WaitingForOpponentMessage {
  code: MessageCode.WaitingForOpponent;
}

export interface OpponentConnectedMessage {
  code: MessageCode.OpponentConnected
}

export interface OpponentReadyMessage {
  code: MessageCode.OpponentReady
}

export interface GameStartedMessage {
  code: MessageCode.GameStarted;
  playsFirst: string;
}

export type Message =
 | ShootMessage
 | HitMessage
 | MissMessage
 | ErrorMessage
 | WaitingForOpponentMessage
 | OpponentConnectedMessage
 | OpponentReadyMessage
 | GameStartedMessage;
