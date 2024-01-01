import { ShipOrientation, ShipPlacement, ShipClassName } from './Ship';
import { GameSetting, DefaultSettings } from './GameSettings';
import { assertNever } from '../utils/typeUtils';
import GameplayError from './GameplayError';

export enum CellState {
  Empty = 1,
  Populated,
  Miss,
  Hit,
}

export enum Player {
  Player1 = 1,
  Player2 = 2,
}

export interface MoveResult {
  hit: boolean,
  gameWon: boolean,
  shipSunk?: ShipPlacement,
}

interface ShipState {
  ship: ShipPlacement;
  aliveCells: number;
}

type BoardRowType = Uint8Array;
type PlayerBoard = BoardRowType[];

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

  // Player 1's cell grid
  private player1Board: PlayerBoard;

  // Player 1's ship states - counters for number of 'alive' cells for each ship
  private p1Ships: ShipState[] = [];

  // Player 2's cell grid
  private player2Board: PlayerBoard;

  // Player 2's ship states - counters for number of 'alive' cells for each ship
  private p2Ships: ShipState[] = [];

  /**
   * Creates an instance of Board. Initializes each players grids with
   * empty cells.
   * @param {GameSetting} [settings=DefaultSettings]
   * @memberof Board
   */
  constructor(settings: GameSetting = DefaultSettings) {
    // save the settings
    this.settings = settings;

    // initialize the playerBoards
    this.player1Board = Board.initPlayerBoard(settings);
    this.player2Board = Board.initPlayerBoard(settings);
  }

  /**
   * Construct a player board filled with empty cells.
   *
   * @param settings The game settings to be used.
   * @returns An initailized player board.
   */
  private static initPlayerBoard = (settings: GameSetting): PlayerBoard => {
    // initialize the grids as 2D arrays, the 'outer' array will
    // hold instances of Uint8Arrays, each of which represents a row of cells
    const board = new Array(settings.boardHeight);

    // create the row arrays and fill them with empty cells
    for (let row: number = 0; row < settings.boardHeight; row += 1) {
      board[row] = (new Uint8Array(settings.boardWidth)).fill(CellState.Empty);
    }

    return board;
  };

  private static initShipStates = (ships: ShipPlacement[]): ShipState[] => ships.map((ship) => ({
    ship,
    aliveCells: ship.shipClass.size,
  }));

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
   * @static
   */
  private static checkPosition = (placement: ShipPlacement, settings: GameSetting): boolean => {
    // Destructure the member properties
    const {
      shipClass, orientation, x, y,
    } = placement;

    // Check that the whole ship is within bounds according to its orientation.
    // The coordinates (x, y) of the ship mark the topmost part of the ship when
    // oriented vertically, and the leftmost part when oriented horizontally,
    // so in each case the ships size needs to be taken into account when checking
    // bounds.
    switch (orientation) {
      case ShipOrientation.Vertical:
        // For vertically oriented ships, make sure x is within bounds...
        if (x < 0 || x >= settings.boardWidth) return false;
        // ... and the topmost part (y) is >0 and the bottom-most part (y+shipSize)
        // is not greater than the board height (also means y by itself cannot be
        // greater than board height).
        if (y < 0 || y + shipClass.size > settings.boardHeight) return false;
        return true;
      case ShipOrientation.Horizontal:
        // Analogous to the case for vartical orientation, same checks but
        // the directions are switched
        if (x < 0 || x + shipClass.size > settings.boardWidth) return false;
        if (y < 0 || y >= settings.boardHeight) return false;
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
   * Check for ship overlap when placing a ship onto a board.
   * This method checks that a ship isn't placed over another ship,
   * or within one cell distance of another placed ship.
   *
   * @param playerBoard The players board onto which a ship is being placed
   * @param ship The ship being placed
   * @param settings The GameSettings to be used
   * @returns true if there is no overlap, false is overlap is detected
   */
  private static checkOverlap = (
    playerBoard: PlayerBoard,
    ship: ShipPlacement,
    settings: GameSetting,
  ): boolean => {
    // Destructure the placement values
    const {
      shipClass, x, y, orientation,
    } = ship;
    const { boardWidth, boardHeight } = settings;

    // Calculate the bounds within which no other ship
    // should be placed
    const xStart = Math.max(0, x - 1);
    const xEnd = orientation === ShipOrientation.Horizontal
      ? Math.min(boardWidth - 1, x + shipClass.size)
      : Math.min(boardWidth - 1, x + 1);
    const yStart = Math.max(0, y - 1);
    const yEnd = orientation === ShipOrientation.Vertical
      ? Math.min(boardHeight - 1, y + shipClass.size)
      : Math.min(boardHeight - 1, y + 1);

    // Check that no other ship is placed within the calculated bounds
    for (let row = yStart; row <= yEnd; row += 1) {
      const rowArray = playerBoard[row];

      for (let col = xStart; col <= xEnd; col += 1) {
        if (rowArray[col] !== CellState.Empty) {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Place a ship in vertical orientation onto a grid.
   * Sets the state of the cells occupied by the ship to 'Populated'.
   * Checks for ship crossovers - throws an error if an attempt is made
   * to place a ship onto an already populated cell, or right next to
   * another ship.
   *
   * @private
   * @param {PlayerBoard} playerBoard The grid onto which the ship should be placed
   * @param {ShipPlacement} ship The ship to be placed
   * @param {GameSetting} settings The GameSettings to be used
   * @memberof Board
   */
  private static placeShipVertical = (
    playerBoard: PlayerBoard,
    ship: ShipPlacement,
    settings: GameSetting,
  ): void => {
    // Destructure the placement values
    const {
      shipClass, x, y,
    } = ship;

    // Check for ship overlap before placing the ship
    if (!Board.checkOverlap(playerBoard, ship, settings)) {
      throw new Error('Ship placement error - ship crossover');
    }

    // After the overlap check is completed, place the ship.
    // When placing a ship vertically, in each of the rows within the
    // range [y, y+shipSize> the cell at position x needs to be marked Populated
    for (let row = y; row - y < shipClass.size; row += 1) {
      const rowArray = playerBoard[row];

      // Mark the appropriate cell Populated
      rowArray[x] = CellState.Populated;
    }
  };

  /**
   * Place a ship in horizontal orientation onto a grid.
   * Sets the state of the cells occupied by the ship to 'Populated'.
   * Checks for ship crossovers - throws an error if an attempt is made
   * to place a ship onto an already populated cell, or right next to
   * another ship.
   *
   * @private
   * @param {PlayerBoard} playerBoard The grid onto which the ship should be placed
   * @param {ShipPlacement} ship The ship to be placed
   * @param {GameSetting} settings The GameSettings to be used
   * @memberof Board
   */
  private static placeShipHorizontal = (
    playerBoard: PlayerBoard,
    ship: ShipPlacement,
    settings: GameSetting,
  ): void => {
    // Destructure the placement values
    const {
      shipClass, x, y,
    } = ship;

    // Check for ship overlap before placing the ship
    if (!Board.checkOverlap(playerBoard, ship, settings)) {
      throw new Error('Ship placement error - ship crossover');
    }

    // When placing a ship horizontally, only the appropirate grid row needs
    // to be found...
    const row = playerBoard[y];

    // ... and within the row, the cells within the range [x, x+shipSIze> need
    // to be marked Populated
    for (let pos = x; pos - x < shipClass.size; pos += 1) {
      // Mark the cell Populated
      row[pos] = CellState.Populated;
    }
  };

  /**
   * Place a ship onto a players board.
   *
   * @param playerBoard The board onto which to place the ship
   * @param ship The Ship to be placed
   * @param {GameSetting} settings The GameSettings to be used
   */
  private static placeShip = (
    playerBoard: PlayerBoard,
    ship: ShipPlacement,
    settings: GameSetting,
  ): void => {
    // Get the orientation for the placement
    const { orientation } = ship;

    // Call the appropriate method for each orientaion
    switch (orientation) {
      case ShipOrientation.Vertical:
        return Board.placeShipVertical(playerBoard, ship, settings);
      case ShipOrientation.Horizontal:
        return Board.placeShipHorizontal(playerBoard, ship, settings);
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
   * @param {GameSetting} settings The GameSettings to be used
   */
  private static placeShips = (
    playerBoard: PlayerBoard,
    ships: ShipPlacement[],
    settings: GameSetting,
  ): void => {
    const errors = Board.verifyShipPlacements(ships, settings);

    if (errors.length !== 0) {
      throw new Error('Cannot place ships - ship placements are invalid');
    }

    ships.forEach((placement) => {
      // Place the ship
      Board.placeShip(playerBoard, placement, settings);
    });
  };

  /**
   * Verify that the given array of ShipPlacements is valid - the exact
   * number of ships of each types as specified in the GameSettings is provided,
   * they are all inside Board bounds, and none of them have any overlap.
   *
   * @param ships The ship placements to validate
   * @param {GameSetting} settings The GameSettings to be used
   * @returns An empty array if no errors are found, or an array of string descriptions
   *          of any found errors.
   * @static
   */
  public static verifyShipPlacements = (
    ships: ShipPlacement[],
    settings: GameSetting,
  ): string[] => {
    // Create a copy of the specified ship counts provided by the GameSettings
    const shipCounts = new Map<ShipClassName, number>(settings.shipCounts);
    // Counter for number of ships placed
    let placed = 0;

    const testBoard = this.initPlayerBoard(settings);

    // Found errors
    const errors = [];

    ships.forEach((placement) => {
      // Check that the ship placement is within board bounds
      if (!Board.checkPosition(placement, settings)) {
        errors.push(
          `${placement.shipClass.type} at (${placement.x}, ${placement.y}) `
          + `${placement.orientation.charAt(0)} - out of bounds`,
        );
      }

      // Check to make sure that no extra instances of the current ship type
      // are attempted to be placed
      const remaining = shipCounts.get(placement.shipClass.type) ?? 0;
      if (!remaining) {
        errors.push(`Too many ${placement.shipClass.type}s given`);
      }

      // Attempt to place the ship onto a test board
      try {
        Board.placeShip(testBoard, placement, settings);
      } catch {
        // If ship placement failed, ship overlap has been detected.
        errors.push(
          `${placement.shipClass.type} at (${placement.x}, ${placement.y}) `
          + `${placement.orientation.charAt(0)} - ship overlap`,
        );
      }

      // Increase the total counter...
      placed += 1;
      // ... and decrease the remaining ships of the placed type
      shipCounts.set(placement.shipClass.type, remaining - 1);
    });

    // Check that all of the expected ships have been placed
    if (placed !== settings.totalShips) {
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
    try {
      Board.placeShips(this.player1Board, ships, this.settings);
      this.p1Ships = Board.initShipStates(ships);
    } catch (error) {
      // If an error has occured during ship placement, reset the
      // player board before passing on the error
      this.player1Board = Board.initPlayerBoard(this.settings);
      this.p1Ships = [];
      throw error;
    }
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
    try {
      Board.placeShips(this.player2Board, ships, this.settings);
      this.p2Ships = Board.initShipStates(ships);
    } catch (error) {
      // If an error has occured during ship placement, reset the
      // player board before passing on the error
      this.player2Board = Board.initPlayerBoard(this.settings);
      this.p2Ships = [];
      throw error;
    }
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
   * Get the state of the ship occupying the cell at (col, row), if any.
   *
   * @param player The player whoose board is being checked.
   * @param col The board column.
   * @param row The board row.
   * @returns The ShipState of a ship which is occupying the given cell position, or
   *          undefined if the specified cell isn't occupied by a ship.
   */
  private getShip = (player: Player, col: number, row: number): ShipState => {
    const ships = player === Player.Player1
      ? this.p1Ships
      : this.p2Ships;

    const found = ships.find(((ship) => {
      const {
        x, y, orientation, shipClass,
      } = ship.ship;

      if (orientation === ShipOrientation.Horizontal) {
        return row === y && col >= x && col < x + shipClass.size;
      }
      return col === x && row >= y && row < y + shipClass.size;
    }));

    if (!found) throw new Error(`No ship at coordinates (${col}, ${row})`);

    return found;
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
      throw new GameplayError('Hit coordinates out of bounds');
    }

    const opponent: Player = player === Player.Player1 ? Player.Player2 : Player.Player1;

    // Get the opponents board
    const targetBoard = opponent === Player.Player1
      ? this.player1Board
      : this.player2Board;

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
        throw new GameplayError('Cell has already been hit');
      default:
        return assertNever(currentState);
    }

    // Set the new state
    targetBoard[y][x] = newState;

    // Construct a default return value
    const result: MoveResult = {
      hit: false,
      gameWon: false,
      shipSunk: undefined,
    };

    // If a ship has been hit...
    if (newState === CellState.Hit) {
      // Set the return property to true
      result.hit = true;

      // Check if a ship has been copletely sunk
      const shipState = this.getShip(opponent, x, y);
      shipState.aliveCells -= 1;
      if (shipState.aliveCells === 0) {
        result.shipSunk = shipState.ship;
      }

      // Check if all of the ships are sunk
      if (opponent === Player.Player1) {
        result.gameWon = this.p1Ships.every((state) => state.aliveCells === 0);
      } else {
        result.gameWon = this.p2Ships.every((state) => state.aliveCells === 0);
      }
    }

    return result;
  };

  /**
   * Get this boards GameSettings
   *
   * @returns The GameSettings
   */
  getSettings = (): GameSetting => this.settings;
}

export default Board;
