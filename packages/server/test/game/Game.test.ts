import { describe, beforeEach, expect, test } from 'vitest'
import Game, { GameState } from "../../src/game/Game.js";
import DefaultSettings from "../../src/game/DefaultSettings.js";
import {
  p1Placements,
  p2Placements,
  firstPlayer,
  secondPlayer,
  moves,
} from "./gameTestData.js";
import { CellHitResult } from "@battleship/common/types/GameTypes.js";


let gameSubject: Game;

describe("Game", () => {
  beforeEach(() => {
    gameSubject = new Game(firstPlayer, secondPlayer, DefaultSettings);
  });

  test("constructor creates a new Game object", () => {
    expect(gameSubject).toBeDefined();
    expect(gameSubject.getGameState()).toBe(GameState.Created);
  });

  test("starting an uninitialized game throws an error", () => {
    expect(() => gameSubject.start()).toThrow();
  });

  test("making a move in a game that is not in progress throws an error", () => {
    expect(() => gameSubject.makeMove(firstPlayer, 0, 0)).toThrow();
  });
});

describe("An initialized game", () => {
  beforeEach(() => {
    gameSubject = new Game(firstPlayer, secondPlayer, DefaultSettings);
    gameSubject.initialize(p1Placements, p2Placements);
  });

  test("throws an error when attempting to initialize again", () => {
    expect(() => gameSubject.initialize(p1Placements, p2Placements)).toThrow();
  });

  test("has the correct state, and can be started", () => {
    expect(gameSubject.getGameState()).toBe(GameState.Initialized);

    gameSubject.start();

    expect(gameSubject.getGameState()).toBe(GameState.InProgress);
  });
});

describe("A game in progress", () => {
  beforeEach(() => {
    gameSubject = new Game(firstPlayer, secondPlayer, DefaultSettings);
    gameSubject.initialize(p1Placements, p2Placements);
    gameSubject.start();
  });

  test("returns the correct current player", () => {
    expect(gameSubject.getCurrentPlayer()).toBe(firstPlayer);
  });

  test("making a move out of turn throws an error", () => {
    expect(() => gameSubject.makeMove(secondPlayer, 1, 1)).toThrow();
  });

  test("aiming for a cell out of bounds throws an error", () => {
    expect(() => gameSubject.makeMove(firstPlayer, 10, 10)).toThrow();
  });

  test(`hitting an empty opponent cell returns the correct result
        and moves on to the next player`, () => {
    const result = gameSubject.makeMove(firstPlayer, 5, 5);
    const currentPlayer = gameSubject.getCurrentPlayer();
    const expectedResult: CellHitResult = {
      position: {
        x: 5,
        y: 5,
      },
      hit: false,
      gameWon: false,
    };

    expect(result).toEqual(expectedResult);
    expect(currentPlayer).toBe(secondPlayer);
  });

  test(`hitting a populated opponent cell returns the correct result
  and keeps the current player`, () => {
    const result = gameSubject.makeMove(firstPlayer, 0, 0);
    const currentPlayer = gameSubject.getCurrentPlayer();

    const expectedResult: CellHitResult = {
      position: {
        x: 0,
        y: 0,
      },
      hit: true,
      gameWon: false,
    };

    expect(result).toEqual(expectedResult);
    expect(currentPlayer).toBe(firstPlayer);
  });

  test(`hitting an already hit opponent cell throws an error
  and keeps the current player`, () => {
    gameSubject.makeMove(firstPlayer, 9, 0);
    gameSubject.makeMove(secondPlayer, 0, 0);

    expect(() => gameSubject.makeMove(firstPlayer, 9, 0)).toThrow();

    const currentPlayer = gameSubject.getCurrentPlayer();
    expect(currentPlayer).toBe(firstPlayer);
  });

  test("finishing a game sets its state to finished", () => {
    gameSubject.finishGame();

    expect(gameSubject.getGameState()).toBe(GameState.Finished);
  });

  test("making a move on a finished game throws an error", () => {
    gameSubject.finishGame();

    expect(() => gameSubject.makeMove(firstPlayer, 0, 0)).toThrow();
  });

  test("performs a valid seqence of moves as expected", () => {
    moves.forEach(({ player, x, y, result }) => {
      const actualResult = gameSubject.makeMove(player, x, y);
      expect(actualResult).toEqual(result as CellHitResult);
    });
  });
});

describe("A finished game", () => {
  beforeEach(() => {
    gameSubject = new Game(firstPlayer, secondPlayer, DefaultSettings);
    gameSubject.initialize(p1Placements, p2Placements);
    gameSubject.start();
    moves.forEach(({ player, x, y }) => {
      gameSubject.makeMove(player, x, y);
    });
  });

  test("can be restarted and played again", () => {
    gameSubject.resetGame();
    gameSubject.initialize(p1Placements, p2Placements);
    gameSubject.start();

    // Since the game was restarted and previously 'firstPlayer' made the first
    // move, now 'secondPlayer' needs to make the first move.
    const firstMove = gameSubject.makeMove(secondPlayer, 9, 0);
    expect(firstMove).toEqual({
      position: {
        x: 9,
        y: 0,
      },
      hit: false,
      gameWon: false,
    });

    // After 'secondPlayer' has made the first move, continue testing
    // with the rest of the test moves.
    moves.forEach(({ player, x, y }) => {
      gameSubject.makeMove(player, x, y);
    });
  });
});
