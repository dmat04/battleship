import Board, { DefaultSettings } from '../../src/game/Board';
import {
  CellState, GameSetting, ShipType, ShipOrientation, ShipPlacement,
} from '../../src/game/types';

const gameSettings = [
  DefaultSettings,
  new GameSetting(8, 16, DefaultSettings.shipCounts),
  new GameSetting(16, 8, DefaultSettings.shipCounts),
];

const expectedPopulatedCells = 18;
const validPlacement: ShipPlacement[] = [
  {
    shipType: ShipType.AircraftCarrier, orientation: ShipOrientation.Vertical, x: 9, y: 1,
  },
  {
    shipType: ShipType.Battleship, orientation: ShipOrientation.Vertical, x: 7, y: 4,
  },
  {
    shipType: ShipType.Cruiser, orientation: ShipOrientation.Horizontal, x: 7, y: 9,
  },
  {
    shipType: ShipType.Destroyer, orientation: ShipOrientation.Vertical, x: 1, y: 1,
  },
  {
    shipType: ShipType.Destroyer, orientation: ShipOrientation.Horizontal, x: 3, y: 4,
  },
  {
    shipType: ShipType.Submarine, orientation: ShipOrientation.Vertical, x: 3, y: 2,
  },
  {
    shipType: ShipType.Submarine, orientation: ShipOrientation.Vertical, x: 8, y: 8,
  },
];

describe('Board', () => {
  test.each(gameSettings)('Constructor creates an empty board', (setting) => {
    const playerBoards = (new Board(setting)).getPlayerBoardCopies();

    playerBoards.forEach((board) => {
      expect(board).toHaveLength(setting.boardHeight);
      board.forEach((row) => {
        expect(row).toHaveLength(setting.boardWidth);
        row.forEach((cell) => {
          expect(cell).toBe(CellState.Empty);
        });
      });
    });
  });

  test('Placing a valid configuration of ships populates the correct cells', () => {
    const gameBoard = new Board(DefaultSettings);

    gameBoard.placePlayer1Ships(validPlacement);
    gameBoard.placePlayer2Ships(validPlacement);

    const playerCells = gameBoard.getPlayerBoardCopies();

    playerCells.forEach((board) => {
      let populatedCellCount = 0;
      board.forEach((row) => {
        row.forEach((cell) => {
          expect([CellState.Empty, CellState.Populated]).toContain(cell);
          if (cell === CellState.Populated) populatedCellCount += 1;
        });
      });

      expect(populatedCellCount).toBe(expectedPopulatedCells);
    });
  });
});
