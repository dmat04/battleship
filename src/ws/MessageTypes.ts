export enum MessageCode {
  Shoot = 'Shoot',
  Hit = 'Hit',
  Miss = 'Miss',
  Error = 'Error',
}

export interface BaseMessage {
  code: MessageCode;
}

export interface ShootMessage extends BaseMessage {
  code: MessageCode.Shoot;
  x: number;
  y: number;
}

export interface HitMessage extends BaseMessage {
  code: MessageCode.Hit;
  x: number;
  y: number;
}

export interface MissMessage extends BaseMessage {
  code: MessageCode.Miss;
  x: number;
  y: number;
}

export interface ErrorMessage extends BaseMessage {
  code: MessageCode.Error;
  message: string;
}
