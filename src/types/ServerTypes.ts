export enum ShipClassName {
  SUBMARINE = 'SUBMARINE',
  DESTROYER = 'DESTROYER',
  CRUISER = 'CRUISER',
  BATTLESHIP = 'BATTLESHIP',
  CARRIER = 'CARRIER',
}

export enum ShipOrientation {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}

export interface ShipClass {
  readonly type: ShipClassName;
  readonly size: number;
}

export interface ShipCount {
  readonly class: ShipClassName;
  readonly count: number;
}

export interface ShipPlacement {
  readonly shipClass: ShipClassName;
  readonly orientation: ShipOrientation;
  readonly x: number;
  readonly y: number;
}

export interface GameSettings {
  readonly boardWidth: number;
  readonly boardHeight: number;
  readonly shipClasses: ShipClass[];
  readonly shipCounts: ShipCount[];
}

export interface GameRoomStatus {
  player1: string;
  player2: string | undefined;
  p1WSOpen: boolean;
  p2WSOpen: boolean;
  p1ShipsPlaced: boolean;
  p2ShipsPlaced: boolean;
  currentPlayer: string;
}

export interface LoginResult {
  username: string;
  accessToken: string;
  expiresAt: string;
}

export interface RoomCreatedResult {
  readonly roomID: string;
  readonly inviteCode: string;
  readonly wsAuthCode: string;
}

export interface RoomJoinedResult {
  readonly roomID: string;
  readonly wsAuthCode: string;
}
