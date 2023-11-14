/* eslint-disable max-classes-per-file */
export type ShipCounts = Map<ShipType, number>;

export enum ShipType {
  Submarine = 'Submarine',
  Destroyer = 'Destroyer',
  Cruiser = 'Cruiser',
  Battleship = 'Battleship',
  AircraftCarrier = 'AircraftCarrier',
}

export enum ShipOrientation {
  Vertical = 'Vertical',
  Horizontal = 'Horizontal',
}

export class ShipPlacement {
  constructor(
    readonly shipType: ShipType,
    readonly orientation: ShipOrientation,
    readonly x: number,
    readonly y: number,
  ) {}

  public toString = (): string => `${this.shipType} at (${this.x}, ${this.y}) ${this.orientation}`;
}

export enum CellState {
  Empty = 1,
  Populated,
  Miss,
  Hit,
}

export class GameSetting {
  constructor(
    readonly boardWidth: number,
    readonly boardHeight: number,
    readonly shipCounts: ShipCounts,
  ) { }
}

export enum Player {
  Player1 = 1,
  Player2 = 2,
}

export enum MoveResult {
  Miss = 'Miss',
  Hit = 'Hit',
  GameWon = 'GameWon',
}
