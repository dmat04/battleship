import Ship, { ShipCounts, ShipType } from './Ship';

export class GameSetting {
  // Total number of cells occupied by ships (per player)
  public readonly totalShipCells: number;

  // Total number of ships (per player)
  // Will be calculated whe constructing from the provided GameSettings.
  public readonly totalShips: number;

  constructor(
    readonly boardWidth: number,
    readonly boardHeight: number,
    readonly shipCounts: ShipCounts,
  ) {
    // count the total number of ships and ship cells
    let shipCount = 0;
    let cellCount = 0;
    shipCounts.forEach((count, shipType) => {
      shipCount += count;
      cellCount += count * Ship.Get(shipType).size;
    });

    this.totalShips = shipCount;
    this.totalShipCells = cellCount;
  }
}

/**
 * Default game settings - specifies a board size of 10x10 cells,
 * and available ships as follows: 2 each of Submarine and Destroyer,
 * 1 each of Cruiser, Battleship and AircraftCarrier.
 */
export const DefaultSettings: GameSetting = new GameSetting(
  10,
  10,
  new Map<ShipType, number>([
    [ShipType.Submarine, 2],
    [ShipType.Destroyer, 2],
    [ShipType.Cruiser, 1],
    [ShipType.Battleship, 1],
    [ShipType.AircraftCarrier, 1],
  ]),
);

export enum MoveResult {
  Miss = 'Miss',
  Hit = 'Hit',
  GameWon = 'GameWon',
}
