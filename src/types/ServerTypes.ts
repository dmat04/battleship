export enum ShipOrientation {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}

export enum ShipType {
  SUBMARINE = 'SUBMARINE',
  DESTROYER = 'DESTROYER',
  CRUISER = 'CRUISER',
  BATTLESHIP = 'BATTLESHIP',
  CARRIER = 'CARRIER',
}

export interface ShipPlacement {
  readonly shipType: ShipType;
  readonly orientation: ShipOrientation;
  readonly x: number;
  readonly y: number;
}

export interface GameSettings {
  readonly totalShipCells: number;
  readonly totalShips: number;
  readonly boardWidth: number;
  readonly boardHeight: number;
  readonly shipCounts: Map<ShipType, number>;
}

export interface LoginResult {
  username: string,
  accessToken: string,
  expiresAt: string
}
