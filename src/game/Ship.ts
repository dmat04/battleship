import assertNever from '../utils/typeUtils';
import { ShipType } from './types';

/** Maximum ship size (length) */
export const MAX_SIZE = 5;

/**
 * Class modelling a battleship game ship.
 * Each ship has a type property and its size (length) measured in
 * the number of game board cells it occupies.
 * New Ship instances cannot be created, all of the existing ship types
 * are accessible as static member singleton instances of this class.
 *
 * @class Ship
 */
class Ship {
  // The five available ship type instances
  private static submarineInstance: Ship;

  private static destroyerInstance: Ship;

  private static cruiserInstance: Ship;

  private static battleshipInstance: Ship;

  private static aircraftCarrierInstance: Ship;

  /**
   * Creates an instance of Ship.
   * @param {ShipType} type - The type of the ship
   * @param {number} size - The size of the ship, must be 0 < size <= MAX_SIZE
   * @memberof Ship
   */
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

  /**
   * Get the ship instance for a given ship type
   *
   * @static
   * @param {ShipType} type - The type of the ship
   * @memberof Ship
   * @returns {Ship}
   */
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

  /**
   * Get the ShipType.Submarine Ship instance
   *
   * @static
   * @memberof Ship
   */
  public static Submarine = (): Ship => {
    if (!this.submarineInstance) {
      this.submarineInstance = new Ship(ShipType.Submarine, 1);
    }

    return this.submarineInstance;
  };

  /**
  * Get the ShipType.Destroyer Ship instance
  *
  * @static
  * @memberof Ship
  */
  public static Destroyer = (): Ship => {
    if (!this.destroyerInstance) {
      this.destroyerInstance = new Ship(ShipType.Destroyer, 2);
    }

    return this.destroyerInstance;
  };

  /**
  * Get the ShipType.Cruiser Ship instance
  *
  * @static
  * @memberof Ship
  */
  public static Cruiser = (): Ship => {
    if (!this.cruiserInstance) {
      this.cruiserInstance = new Ship(ShipType.Cruiser, 3);
    }

    return this.cruiserInstance;
  };

  /**
  * Get the ShipType.Battleship Ship instance
  *
  * @static
  * @memberof Ship
  */
  public static Battleship = (): Ship => {
    if (!this.battleshipInstance) {
      this.battleshipInstance = new Ship(ShipType.Battleship, 4);
    }

    return this.battleshipInstance;
  };

  /**
  * Get the ShipType.AircraftCarrier Ship instance
  *
  * @static
  * @memberof Ship
  */
  public static AircraftCarrier = (): Ship => {
    if (!this.aircraftCarrierInstance) {
      this.aircraftCarrierInstance = new Ship(ShipType.AircraftCarrier, 5);
    }

    return this.aircraftCarrierInstance;
  };
}

export default Ship;
