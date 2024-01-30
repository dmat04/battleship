import Board, { CellState } from '../../src/game/Board';
import DefaultSettings from '../../src/game/DefaultSettings';
import { GameSettings } from '../../src/graphql/types.generated';
import { validPlacements, invalidPlacements } from './shipPlacementData';

const gameSettings: GameSettings[] = [
  DefaultSettings,
  { ...DefaultSettings, boardHeight: 8, boardWidth: 16 },
  { ...DefaultSettings, boardHeight: 16, boardWidth: 8 },
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

      gameBoard.placePlayer1Ships(placements);
      gameBoard.placePlayer2Ships(placements);

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

      expect(() => gameBoard.placePlayer1Ships(placements))
        .toThrow();
      expect(() => gameBoard.placePlayer2Ships(placements))
        .toThrow();
    },
  );
});
