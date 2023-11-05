import Ship from './Ship';
import {
  CellState, GameSetting, ShipType, ShipPlacement, ShipOrientation,
} from './types';
import assertNever from '../utils/typeUtils';

type BoardRowType = Uint8Array;
type PlayerBoard = BoardRowType[];

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

class Board {
  private settings: GameSetting;

  private readonly totalShips: number;

  private player1Board: PlayerBoard;

  private player2Board: PlayerBoard;

  constructor(settings: GameSetting) {
    this.settings = settings;
    this.totalShips = [...settings.shipCounts.values()]
      .reduce((acc, val) => acc + val);

    this.player1Board = new Array(settings.boardHeight);
    this.player2Board = new Array(settings.boardHeight);

    for (let row: number = 0; row < settings.boardHeight; row += 1) {
      this.player1Board[row] = (new Uint8Array(settings.boardWidth)).fill(CellState.Empty);
      this.player2Board[row] = (new Uint8Array(settings.boardWidth)).fill(CellState.Empty);
    }
  }

  private checkPosition = (placement: ShipPlacement): boolean => {
    const {
      shipType, orientation, x, y,
    } = placement;
    const shipSize = Ship.Get(shipType).size;

    switch (orientation) {
      case ShipOrientation.Vertial:
        if (y < 0 || y >= this.settings.boardHeight) return false;
        if (x < 0 || x + shipSize > this.settings.boardWidth) return false;
        return true;
      case ShipOrientation.Horizontal:
        if (x < 0 || x >= this.settings.boardWidth) return false;
        if (y < 0 || y + shipSize > this.settings.boardHeight) return false;
        return true;
      default:
        return assertNever(orientation);
    }
  };

  private static placeShipVertical = (playerBoard: PlayerBoard, ship: ShipPlacement): void => {
    const {
      shipType, x, y,
    } = ship;
    const shipSize = Ship.Get(shipType).size;

    for (let row = y; row - y < shipSize; row += 1) {
      const rowArray = playerBoard[row];
      if (rowArray[x] !== CellState.Empty) {
        throw new Error('Ship placement error - ship crossover');
      }

      rowArray[x] = CellState.Populated;
    }
  };

  private static placeShipHorizontal = (playerBoard: PlayerBoard, ship: ShipPlacement): void => {
    const {
      shipType, x, y,
    } = ship;
    const shipSize = Ship.Get(shipType).size;

    const row = playerBoard[y];

    for (let pos = x; pos - x < shipSize; pos += 1) {
      if (row[pos] !== CellState.Empty) {
        throw new Error('Ship placement error - ship crossover');
      }

      row[pos] = CellState.Populated;
    }
  };

  private static placeShip = (playerBoard: PlayerBoard, ship: ShipPlacement): void => {
    const { orientation } = ship;

    switch (orientation) {
      case ShipOrientation.Vertial:
        return Board.placeShipVertical(playerBoard, ship);
      case ShipOrientation.Horizontal:
        return Board.placeShipHorizontal(playerBoard, ship);
      default:
        return assertNever(orientation);
    }
  };

  private placeShips = (playerBoard: PlayerBoard, ships: ShipPlacement[]): void => {
    const shipCounts = new Map<ShipType, number>(this.settings.shipCounts);
    let placed = 0;

    ships.forEach((placement) => {
      if (!this.checkPosition(placement)) {
        throw new Error('Ship placement error - ship out of bounds');
      }

      const remaining = shipCounts.get(placement.shipType);
      if (!remaining) {
        throw new Error('Ship placement error - unexpected ship');
      }

      Board.placeShip(playerBoard, placement);

      placed += 1;
      shipCounts.set(placement.shipType, remaining - 1);
    });

    if (placed !== this.totalShips) {
      throw new Error('Ship placement error - not all ships placed');
    }
  };

  placePlayer1Ships = (ships: ShipPlacement[]): void => {
    this.placeShips(this.player1Board, ships);
  };

  placePlayer2Ships = (ships: ShipPlacement[]): void => {
    this.placeShips(this.player2Board, ships);
  };

  getPlayerBoardCopies = (): PlayerBoard[] => {
    const player1Copy = this.player1Board.map((row) => row.map((it) => it));
    const player2Copy = this.player2Board.map((row) => row.map((it) => it));

    return [player1Copy, player2Copy];
  };
}

export default Board;
