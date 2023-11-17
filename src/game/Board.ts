import Ship from './Ship';
import {
  CellState, GameSetting, ShipType, ShipPlacement, ShipOrientation, MoveResult, Player,
} from './types';
import { assertNever } from '../utils/typeUtils';

type BoardRowType = Uint8Array;
type PlayerBoard = BoardRowType[];

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

/**
 * Class representing the game board - consists of each players cell grid
 * and tracks cell states such as: empty, populated, hit, miss.
 * Provides functionality to initilaze the grids, place each players ships
 * and make moves by players against their opponent.
 *
 * @class Board
 */
class Board {
  // GameSettings provided by constructor - used to set the grid sizes,
  // and validate the number of ships placed by each player
  private readonly settings: GameSetting;

  // Total number of cells occupied by ships (per player)
  private readonly totalShipCells: number;

  // Total number of ships (per player)
  // Will be calculated whe constructing from the provided GameSettings.
  private readonly totalShips: number;

  // Player 1's cell grid
  private player1Board: PlayerBoard;

  // Player 1's count of hits against Player 2's ships
  private player1HitCount = 0;

  // Player 2's cell grid
  private player2Board: PlayerBoard;

  // Player 2's count of hits against Player 1's ships
  private player2HitCount = 0;

  /**
   * Creates an instance of Board. Initializes each players grids with
   * empty cells.
   * @param {GameSetting} [settings=DefaultSettings]
   * @memberof Board
   */
  constructor(settings: GameSetting = DefaultSettings) {
    // save the settings
    this.settings = settings;

    // count the total number of ships and ship cells
    let shipCount = 0;
    let cellCount = 0;
    settings.shipCounts.forEach((count, shipType) => {
      shipCount += count;
      cellCount += count * Ship.Get(shipType).size;
    });

    this.totalShips = shipCount;
    this.totalShipCells = cellCount;

    // initialize the grids as 2D arrays, the 'outer' array will
    // hold instances of Uint8Arrays, each of which represents a row of cells
    this.player1Board = new Array(settings.boardHeight);
    this.player2Board = new Array(settings.boardHeight);

    // create the row arrays and fill them with empty cells
    for (let row: number = 0; row < settings.boardHeight; row += 1) {
      this.player1Board[row] = (new Uint8Array(settings.boardWidth)).fill(CellState.Empty);
      this.player2Board[row] = (new Uint8Array(settings.boardWidth)).fill(CellState.Empty);
    }
  }

  /**
   * Check if a ShipPlacement has coordinates within the grid.
   * The given ship coordinates represent the topmost (in vertical
   * orientation) or the leftmost (in horizontal orientation) part of
   * the ship being placed.
   *
   * @private
   * @param {ShipPlacement} placement
   * @returns {boolean} Returns false if any part of the ship is outside
   *                    of the grid bounds, true otherwise
   * @memberof Board
   */
  private checkPosition = (placement: ShipPlacement): boolean => {
    // Destructure the member properties
    const {
      shipType, orientation, x, y,
    } = placement;

    // Get the ship size for the given ship type
    const shipSize = Ship.Get(shipType).size;

    // Check that the whole ship is within bounds according to its orientation.
    // The coordinates (x, y) of the ship mark the topmost part of the ship when
    // oriented vertically, and the leftmost part when oriented horizontally,
    // so in each case the ships size needs to be taken into account when checking
    // bounds.
    switch (orientation) {
      case ShipOrientation.Vertical:
        // For vertically oriented ships, make sure x is within bounds...
        if (x < 0 || x >= this.settings.boardWidth) return false;
        // ... and the topmost part (y) is >0 and the bottom-most part (y+shipSize)
        // is not greater than the board height (also means y by itself cannot be
        // greater than board height).
        if (y < 0 || y + shipSize > this.settings.boardHeight) return false;
        return true;
      case ShipOrientation.Horizontal:
        // Analogous to the case for vartical orientation, same checks but
        // the directions are switched
        if (x < 0 || x + shipSize > this.settings.boardWidth) return false;
        if (y < 0 || y >= this.settings.boardHeight) return false;
        return true;
      default:
        return assertNever(orientation);
    }
  };

  /**
   * Check if given coordinates are within grid bounds.
   */
  private checkCellBounds = (x: number, y: number): boolean => (
    x >= 0
    && x < this.settings.boardWidth
    && y >= 0
    && y < this.settings.boardHeight
  );

  /**
   * Place a ship in vertical orientation onto a grid.
   * Sets the state of the cells occupied by the ship to 'Populated'.
   * Checks for ship crossovers - throws an error if an attempt is made
   * to place a ship onto an already populated cell.
   *
   * @private
   * @static
   * @param {PlayerBoard} playerBoard The grid onto which the ship should be placed
   * @param {ShipPlacement} ship The ship to be placed
   * @memberof Board
   */
  private static placeShipVertical = (playerBoard: PlayerBoard, ship: ShipPlacement): void => {
    // Destructure the placement values
    const {
      shipType, x, y,
    } = ship;
    const shipSize = Ship.Get(shipType).size;

    // When placing a ship vertically, in each of the rows within the
    // range [y, y+shipSize> the cell at position x needsto be marked Populated
    for (let row = y; row - y < shipSize; row += 1) {
      // Get the needed row
      const rowArray = playerBoard[row];

      // Check for crossover
      if (rowArray[x] !== CellState.Empty) {
        throw new Error('Ship placement error - ship crossover');
      }

      // Mark the appropriate cell Populated
      rowArray[x] = CellState.Populated;
    }
  };

  /**
   * Place a ship in horizontal orientation onto a grid.
   * Sets the state of the cells occupied by the ship to 'Populated'.
   * Checks for ship crossovers - throws an error if an attempt is made
   * to place a ship onto an already populated cell.
   *
   * @private
   * @static
   * @param {PlayerBoard} playerBoard The grid onto which the ship should be placed
   * @param {ShipPlacement} ship The ship to be placed
   * @memberof Board
   */
  private static placeShipHorizontal = (playerBoard: PlayerBoard, ship: ShipPlacement): void => {
    // Destructure the placement values
    const {
      shipType, x, y,
    } = ship;
    const shipSize = Ship.Get(shipType).size;

    // When placing a ship horizontally, only the appropirate grid row needs
    // to be found...
    const row = playerBoard[y];

    // ... and within the row, the cells within the range [x, x+shipSIze> need
    // to be marked as Populated
    for (let pos = x; pos - x < shipSize; pos += 1) {
      // Check for crossover
      if (row[pos] !== CellState.Empty) {
        throw new Error('Ship placement error - ship crossover');
      }

      // Mark the cell Populated
      row[pos] = CellState.Populated;
    }
  };

  /**
   * Place a ship onto a players board.
   *
   * @param playerBoard The board onto which to place the ship
   * @param ship The Ship to be placed
   */
  private static placeShip = (playerBoard: PlayerBoard, ship: ShipPlacement): void => {
    // Get the orientation for the placement
    const { orientation } = ship;

    // Call the appropriate method for each orientaion
    switch (orientation) {
      case ShipOrientation.Vertical:
        return Board.placeShipVertical(playerBoard, ship);
      case ShipOrientation.Horizontal:
        return Board.placeShipHorizontal(playerBoard, ship);
      default:
        return assertNever(orientation);
    }
  };

  /**
   * Place all of the ships onto a players board. This method will check for
   * ship placement errors and throw an exception without placing any ship
   * if any error is found.
   *
   * @param playerBoard The board onto which the ships will be placed
   * @param ships The array of ShipPlacements to be placed
   */
  private placeShips = (playerBoard: PlayerBoard, ships: ShipPlacement[]): void => {
    const errors = this.verifyShipPlacements(ships);

    if (errors.length !== 0) {
      throw new Error('Cannot place ships - ship placements are invalid');
    }

    ships.forEach((placement) => {
      // Place the ship
      Board.placeShip(playerBoard, placement);
    });
  };

  /**
   * Verify that the given array of ShipPlacements is valid - the exact 
   * number of ships of each types as specified in the GameSettings is provided,
   * and they are all inside Board bounds.
   *
   * @param ships The ship placements to validate
   * @returns An empty array if no errors are found, or an array of string descriptions
   *          of any found errors.
   */
  public verifyShipPlacements = (ships: ShipPlacement[]): string[] => {
    // Create a copy of the specified ship counts provided by the GameSettings
    const shipCounts = new Map<ShipType, number>(this.settings.shipCounts);
    // Counter for number of ships placed
    let placed = 0;

    // Found errors
    const errors = [];

    ships.forEach((placement) => {
      // Check that the ship placement is within board bounds
      if (!this.checkPosition(placement)) {
        errors.push(
          `${placement.shipType} at (${placement.x}, ${placement.y}) `
          + `${placement.orientation.charAt(0)} - out of bounds`,
        );
      }

      // Check to make sure that no extra instances of the current ship type
      // are attempted to be placed
      const remaining = shipCounts.get(placement.shipType) ?? 0;
      if (!remaining) {
        errors.push(`Too many ${placement.shipType}s given`);
      }

      // Increase the total counter...
      placed += 1;
      // ... and decrease the remaining ships of the placed type
      shipCounts.set(placement.shipType, remaining - 1);
    });

    // Check that all of the expected ships have been placed
    if (placed !== this.totalShips) {
      errors.push('Not all ships placed');
    }

    return errors;
  };

  /**
   * Place Player 1's ships onto Player 1's board.
   * The number of provided ships has to match the number specified
   * in the GameSettings for each ship type, will throw an exception
   * in case of any missing/extra ships.
   * All ships must be completely within the grid boundaries, will throw
   * an exception otherwise
   *
   * @param ships The ships to be placed
   */
  placePlayer1Ships = (ships: ShipPlacement[]): void => {
    this.placeShips(this.player1Board, ships);
  };

  /**
   * Place Player 2's ships onto Player 2's board.
   * The number of provided ships has to match the number specified
   * in the GameSettings for each ship type, will throw an exception
   * in case of any missing/extra ships.
   * All ships must be completely within the grid boundaries, will throw
   * an exception otherwise
   *
   * @param ships The ships to be placed
   */
  placePlayer2Ships = (ships: ShipPlacement[]): void => {
    this.placeShips(this.player2Board, ships);
  };

  /**
   * Get copies of each of the Players game boards in their current state.
   *
   * @returns An array of two PlayerBoards: [ Player1Board, Player2Board ]
   */
  getPlayerBoardCopies = (): PlayerBoard[] => {
    const player1Copy = this.player1Board.map((row) => row.map((it) => it));
    const player2Copy = this.player2Board.map((row) => row.map((it) => it));

    return [player1Copy, player2Copy];
  };

  /**
   * Hit the opposing players grid at specified cell coordinates.
   * Throws an error if cell coordinates are out of board bounds,
   * or the cell has already been struck before.
   *
   * @param player The Player making the hit
   * @param x The x coordinate of the cell to hit
   * @param y The y coordinate of the cell to hit
   * @returns Returns MoveResult.Miss if an empty cell is struck,
   *          MoveResult.Hit if a populated cell is struck, or
   *          MoveResult.GameWon if the last remaining populated cell is struck.
   */
  hitCell = (player: Player, x: number, y: number): MoveResult => {
    // Check if hit is within bounds
    if (!this.checkCellBounds(x, y)) {
      throw new Error('Hit coordinates out of bounds');
    }

    // Get the opponents board
    const targetBoard = player === Player.Player1
      ? this.player2Board
      : this.player1Board;

    // Read the current state of the cell to be hit
    const currentState = targetBoard[y][x] as CellState;
    let newState: CellState;

    // Choose a new state for the cell being hit
    switch (currentState) {
      case CellState.Empty:
        // If the cell was empty, it's new state shall be Miss-ed
        newState = CellState.Miss;
        break;
      case CellState.Populated:
        // If the cell was populated ('alive'), it's new state shall be Hit
        newState = CellState.Hit;
        break;
      case CellState.Miss:
      case CellState.Hit:
        // If the cell had already been hit on, throw an error
        throw new Error('Cell has already been hit');
      default:
        return assertNever(currentState);
    }

    // Set the new state
    targetBoard[y][x] = newState;

    // Decide what to return, Miss by default...
    let moveResult = MoveResult.Miss;
    // ... but, if a ship has been hit ...
    if (newState === CellState.Hit) {
      // ... the result is MoveResult.Hit ...
      moveResult = MoveResult.Hit;

      // ... or if the last 'alive' cell has been hit,
      // the result is GameWon
      if (player === Player.Player1) {
        this.player1HitCount += 1;
        if (this.player1HitCount === this.totalShipCells) {
          moveResult = MoveResult.GameWon;
        }
      } else {
        this.player2HitCount += 1;
        if (this.player1HitCount === this.totalShipCells) {
          moveResult = MoveResult.GameWon;
        }
      }
    }

    return moveResult;
  };

  /**
   * Get this boards GameSettings
   *
   * @returns The GameSettings
   */
  getSettings = (): GameSetting => this.settings;
}

export default Board;
