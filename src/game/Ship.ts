import assertNever from '../utils/typeUtils';
import { ShipType } from './types';

export const MAX_SIZE = 5;

class Ship {
  private static submarineInstance: Ship;

  private static destroyerInstance: Ship;

  private static cruiserInstance: Ship;

  private static battleshipInstance: Ship;

  private static aircraftCarrierInstance: Ship;

  private constructor(
    readonly type: ShipType,
    readonly size: number,
  ) {
    if (
      !Number.isInteger(size)
      || size <= 0
      || size > MAX_SIZE
    ) {
      throw new Error(`Ship size must be an integer inside [0, ${MAX_SIZE}]`);
    }
  }

  public static Get = (type: ShipType): Ship => {
    switch (type) {
      case ShipType.Submarine:
        return this.Submarine();
      case ShipType.Destroyer:
        return this.Destroyer();
      case ShipType.Cruiser:
        return this.Cruiser();
      case ShipType.Battleship:
        return this.Battleship();
      case ShipType.AircraftCarrier:
        return this.AircraftCarrier();
      default:
        return assertNever(type);
    }
  };

  public static Submarine = (): Ship => {
    if (!this.submarineInstance) {
      this.submarineInstance = new Ship(ShipType.Submarine, 1);
    }

    return this.submarineInstance;
  };

  public static Destroyer = (): Ship => {
    if (!this.destroyerInstance) {
      this.destroyerInstance = new Ship(ShipType.Destroyer, 2);
    }

    return this.destroyerInstance;
  };

  public static Cruiser = (): Ship => {
    if (!this.cruiserInstance) {
      this.cruiserInstance = new Ship(ShipType.Cruiser, 3);
    }

    return this.cruiserInstance;
  };

  public static Battleship = (): Ship => {
    if (!this.battleshipInstance) {
      this.battleshipInstance = new Ship(ShipType.Battleship, 4);
    }

    return this.battleshipInstance;
  };

  public static AircraftCarrier = (): Ship => {
    if (!this.aircraftCarrierInstance) {
      this.aircraftCarrierInstance = new Ship(ShipType.AircraftCarrier, 5);
    }

    return this.aircraftCarrierInstance;
  };
}

export default Ship;
