import Board, { CellState } from '../../src/game/Board';
import { ShipPlacement } from '../../src/game/Ship';
import { DefaultSettings, GameSetting } from '../../src/game/types';
import { validPlacements, invalidPlacements } from './shipPlacementData.json';

const gameSettings = [
  DefaultSettings,
  new GameSetting(8, 16, DefaultSettings.shipCounts),
  new GameSetting(16, 8, DefaultSettings.shipCounts),
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

  test.each(validPlacements)(
    'Placing a valid configuration of ships populates the correct cells',
    ({ populatedCells, placements }) => {
      const gameBoard = new Board(DefaultSettings);

      gameBoard.placePlayer1Ships(placements as ShipPlacement[]);
      gameBoard.placePlayer2Ships(placements as ShipPlacement[]);

      const playerCells = gameBoard.getPlayerBoardCopies();

      playerCells.forEach((board) => {
        let populatedCellCount = 0;
        board.forEach((row) => {
          row.forEach((cell) => {
            expect([CellState.Empty, CellState.Populated]).toContain(cell);
            if (cell === CellState.Populated) populatedCellCount += 1;
          });
        });

        expect(populatedCellCount).toBe(populatedCells);
      });
    },
  );

  test.each(invalidPlacements)(
    'Placing an invalid configuration of ships throws an error',
    ({ placements }) => {
      const gameBoard = new Board(DefaultSettings);

      expect(() => gameBoard.placePlayer1Ships(placements as ShipPlacement[]))
        .toThrow();
      expect(() => gameBoard.placePlayer2Ships(placements as ShipPlacement[]))
        .toThrow();
    },
  );
});
