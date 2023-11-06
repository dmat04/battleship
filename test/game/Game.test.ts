import { DefaultSettings } from '../../src/game/Board';
import Game, { GameState } from '../../src/game/Game';
import { MoveResult, Player, ShipPlacement } from '../../src/game/types';
import { validPlacements } from './shipPlacementData.json';

const firstPlayer = Player.Player1;
const secondPlayer = Player.Player2;
let gameSubject: Game;

describe('Game', () => {
  beforeEach(() => {
    gameSubject = new Game(firstPlayer, DefaultSettings);
  })

  test('constructor creates a new Game object', () => {
    expect(gameSubject).toBeDefined();
    expect(gameSubject.getGameState()).toBe(GameState.Created);
  });

  test('starting an uninitialized game throws an error', () => {
    expect(() => gameSubject.start()).toThrow();
  });

  test('making a move in a game that is not in progress throws an error', () => {
    expect(() => gameSubject.makeMove(firstPlayer, 0, 0)).toThrow();
  })
});

describe('An initialized game', () => {
  beforeEach(() => {
    gameSubject = new Game(firstPlayer, DefaultSettings);
    const p1Placement = validPlacements[0].placements as ShipPlacement[];
    const p2Placement = validPlacements[1].placements as ShipPlacement[];
    gameSubject.initialize(p1Placement, p2Placement);
  });

  test('throws an error when attempting to initialize again', () => {
    const p1Placement = validPlacements[0].placements as ShipPlacement[];
    const p2Placement = validPlacements[1].placements as ShipPlacement[];
    
    expect(() => gameSubject.initialize(p1Placement, p2Placement)).toThrow();
  });

  test('has the correct state, and can be started',
    () => {
      expect(gameSubject.getGameState()).toBe(GameState.Initialized);

      gameSubject.start();

      expect(gameSubject.getGameState()).toBe(GameState.InProgress);
    });
});

describe('A game in progress', () => {
  beforeEach(() => {
    gameSubject = new Game(firstPlayer, DefaultSettings);
    const p1Placement = validPlacements[0].placements as ShipPlacement[];
    const p2Placement = validPlacements[1].placements as ShipPlacement[];
    gameSubject.initialize(p1Placement, p2Placement);
    gameSubject.start();
  })

  test('returns the correct current player', () => {
    expect(gameSubject.getCurrentPlayer()).toBe(firstPlayer);
  });

  test('making a move out of turn throws an error', () => {
    expect(() => gameSubject.makeMove(secondPlayer, 1, 1)).toThrow();
  });

  test('aiming for a cell out of bounds throws an error', () => {
    expect(() => gameSubject.makeMove(firstPlayer, 10, 10)).toThrow();
  });

  test(`hitting an empty opponent cell returns the correct result
        and moves on to the next player`, () => {
    const result = gameSubject.makeMove(firstPlayer, 5, 5);
    const currentPlayer = gameSubject.getCurrentPlayer();

    expect(result).toBe(MoveResult.Miss);
    expect(currentPlayer).toBe(secondPlayer);
  });

  test(`hitting a populated opponent cell returns the correct result
  and keeps the current player`, () => {
    const result = gameSubject.makeMove(firstPlayer, 0, 0);
    const currentPlayer = gameSubject.getCurrentPlayer();

    expect(result).toBe(MoveResult.Hit);
    expect(currentPlayer).toBe(firstPlayer);
  });

  test(`hitting an already hit opponent cell throws an error
  and keeps the current player`, () => {
    gameSubject.makeMove(firstPlayer, 9, 0);
    gameSubject.makeMove(secondPlayer, 0, 0);

    expect(() => gameSubject.makeMove(firstPlayer, 9, 0))
      .toThrow();

    const currentPlayer = gameSubject.getCurrentPlayer();
    expect(currentPlayer).toBe(firstPlayer);
  });

  test('finishing a game sets its state to finished', () => {
    gameSubject.finishGame();

    expect(gameSubject.getGameState()).toBe(GameState.Finished);
  });

  test('making a move on a finished game throws an error', () => {
    gameSubject.finishGame();

    expect(() => gameSubject.makeMove(firstPlayer, 0, 0)).toThrow();
  });
})