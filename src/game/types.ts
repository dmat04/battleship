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

export enum Player {
  Player1 = 1,
  Player2 = 2,
}

export enum MoveResult {
  Miss = 'Miss',
  Hit = 'Hit',
  GameWon = 'GameWon',
}
