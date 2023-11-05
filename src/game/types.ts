export type ShipCounts = Map<ShipType, number>;

export enum ShipType {
  Submarine = 1,
  Destroyer,
  Cruiser,
  Battleship,
  AircraftCarrier,
}

export enum ShipOrientation {
  Vertical = 'Vertical',
  Horizontal = 'Horizontal',
}

export interface ShipPlacement {
  shipType: ShipType,
  orientation: ShipOrientation,
  x: number,
  y: number
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
