import Board, { DefaultSettings } from '../../src/game/Board';
import { CellState } from '../../src/game/types';

describe('Board', () => {
  test('Constructor creates an empty board', () => {
    const gameSettings = DefaultSettings;

    const playerBoards = (new Board(gameSettings)).getPlayerBoardCopies();

    playerBoards.forEach((board) => {
      expect(board).toHaveLength(gameSettings.boardHeight);
      board.forEach((row) => {
        expect(row).toHaveLength(gameSettings.boardWidth);
        row.forEach((cell) => {
          expect(cell).toBe(CellState.Empty);
        });
      });
    });
  });
});
