import { assertNever } from '../utils/typeUtils';

/** Maximum ship size (length) */
export const MAX_SIZE = 5;

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

export interface ShipPlacement {
  readonly shipClass: ShipClass;
  readonly orientation: ShipOrientation;
  readonly x: number;
  readonly y: number;
}

/**
 * Class modelling a battleship game ship.
 * Each ship has a type property and its size (length) measured in
 * the number of game board cells it occupies.
 * New Ship instances cannot be created, all of the existing ship types
 * are accessible as static member singleton instances of this class.
 *
 * @class Ship
 */
class ShipClass {
  // The five available ship type instances
  private static submarineInstance: ShipClass;

  private static destroyerInstance: ShipClass;

  private static cruiserInstance: ShipClass;

  private static battleshipInstance: ShipClass;

  private static aircraftCarrierInstance: ShipClass;

  /**
   * Creates an instance of Ship.
   * @param {ShipClassName} type - The type of the ship
   * @param {number} size - The size of the ship, must be 0 < size <= MAX_SIZE
   * @memberof Ship
   */
  private constructor(
    public readonly type: ShipClassName,
    public readonly size: number,
  ) {
    if (
      !Number.isInteger(size)
      || size <= 0
      || size > MAX_SIZE
    ) {
      throw new Error(`Ship size must be an integer inside [0, ${MAX_SIZE}]`);
    }
  }

  /**
   * Get the ship instance for a given ship type
   *
   * @static
   * @param {ShipClassName} type - The type of the ship
   * @memberof Ship
   * @returns {ShipClass}
   */
  public static Get = (type: ShipClassName): ShipClass => {
    switch (type) {
      case ShipClassName.SUBMARINE:
        return this.Submarine();
      case ShipClassName.DESTROYER:
        return this.Destroyer();
      case ShipClassName.CRUISER:
        return this.Cruiser();
      case ShipClassName.BATTLESHIP:
        return this.Battleship();
      case ShipClassName.CARRIER:
        return this.AircraftCarrier();
      default:
        return assertNever(type);
    }
  };

  /**
   * Get the ShipType.Submarine Ship instance
   *
   * @static
   * @memberof Ship
   */
  public static Submarine = (): ShipClass => {
    if (!this.submarineInstance) {
      this.submarineInstance = new ShipClass(ShipClassName.SUBMARINE, 1);
    }

    return this.submarineInstance;
  };

  /**
  * Get the ShipType.Destroyer Ship instance
  *
  * @static
  * @memberof Ship
  */
  public static Destroyer = (): ShipClass => {
    if (!this.destroyerInstance) {
      this.destroyerInstance = new ShipClass(ShipClassName.DESTROYER, 2);
    }

    return this.destroyerInstance;
  };

  /**
  * Get the ShipType.Cruiser Ship instance
  *
  * @static
  * @memberof Ship
  */
  public static Cruiser = (): ShipClass => {
    if (!this.cruiserInstance) {
      this.cruiserInstance = new ShipClass(ShipClassName.CRUISER, 3);
    }

    return this.cruiserInstance;
  };

  /**
  * Get the ShipType.Battleship Ship instance
  *
  * @static
  * @memberof Ship
  */
  public static Battleship = (): ShipClass => {
    if (!this.battleshipInstance) {
      this.battleshipInstance = new ShipClass(ShipClassName.BATTLESHIP, 4);
    }

    return this.battleshipInstance;
  };

  /**
  * Get the ShipType.AircraftCarrier Ship instance
  *
  * @static
  * @memberof Ship
  */
  public static AircraftCarrier = (): ShipClass => {
    if (!this.aircraftCarrierInstance) {
      this.aircraftCarrierInstance = new ShipClass(ShipClassName.CARRIER, 5);
    }

    return this.aircraftCarrierInstance;
  };
}

export default ShipClass;
