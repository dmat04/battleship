import ShipClass, { ShipClassName } from './Ship';

export class GameSetting {
  // Total number of cells occupied by ships (per player)
  public readonly totalShipCells: number;

  // Total number of ships (per player)
  // Will be calculated whe constructing from the provided GameSettings.
  public readonly totalShips: number;

  public readonly shipClasses: Map<ShipClassName, ShipClass> = new Map();

  constructor(
    readonly boardWidth: number,
    readonly boardHeight: number,
    readonly shipCounts: Map<ShipClassName, number>,

  ) {
    // count the total number of ships and ship cells
    // and initialize the ship sizes
    let shipCount = 0;
    let cellCount = 0;
    shipCounts.forEach((count, shipType) => {
      shipCount += count;
      cellCount += count * ShipClass.Get(shipType).size;
      this.shipClasses.set(shipType, ShipClass.Get(shipType));
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
  new Map<ShipClassName, number>([
    [ShipClassName.SUBMARINE, 2],
    [ShipClassName.DESTROYER, 2],
    [ShipClassName.CRUISER, 1],
    [ShipClassName.BATTLESHIP, 1],
    [ShipClassName.CARRIER, 1],
  ]),
);
