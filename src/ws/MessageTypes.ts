export enum MessageCode {
  Shoot = 'Shoot',
  Hit = 'Hit',
  Miss = 'Miss',
  Error = 'Error',
  WaitingForOpponent = 'WaitingForOpponent',
  OpponentConnected = 'OpponentConnected',
  OpponentReady = 'OpponentReady',
}

export interface BaseMessage {
  code: MessageCode;
}

export interface CoordinateMessage {
  x: number;
  y: number;
}

export interface ShootMessage extends BaseMessage, CoordinateMessage {
  code: MessageCode.Shoot;
}

export interface HitMessage extends BaseMessage, CoordinateMessage {
  code: MessageCode.Hit;
}

export interface MissMessage extends BaseMessage, CoordinateMessage {
  code: MessageCode.Miss;
}

export interface ErrorMessage extends BaseMessage {
  code: MessageCode.Error;
  message: string;
}
