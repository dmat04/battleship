import Board, { Player } from './Board';
import { ShipPlacement } from './Ship';
import {
  GameSetting, MoveResult, DefaultSettings,
} from './types';

export enum GameState {
  Created = 'Created',
  Initialized = 'Initialized',
  InProgress = 'InProgress',
  Finished = 'Finished',
}

/**
 * The Game class - holds it's own instance of a Board class
 * and allows players to take turns making moves after proper
 * initialization.
 * The Game can be in four states:
 *  - Created - a new instance of the Game class in initialy in this state
 *  - Initialized - a Game is initialized from the Created state by calling
 *                  the initialize(...) method, after which the start() method
 *                  may be called which will set the Game into the InProgress
 *                  state
 *  - InProgress - a Game is in progress - players can take turns making moves
 *                 against each other
 *  - Finished - the Game is finished by calling the finishGame() method, after
 *               which, no more moves can be made, and the Game cannot be
 *               re-initialized
 */
class Game {
  // The current state of the Game
  private state: GameState;

  // The Board instance
  private readonly board: Board;

  // The current round number
  private round: number;

  // The current player - the player who can make the next move
  private currentPlayer: string;

  private player1: string;

  private player2: string;

  /**
   * Game constructor.
   *
   * @param player1 Name of Player 1 (makes the first move)
   * @param player2 Name of Player 2
   * @param settings The GameSettings which will dictate the Board dimension and
   *                 the numbers of available ships
   */
  constructor(player1: string, player2: string, settings: GameSetting = DefaultSettings) {
    // set the initial state to Created
    this.state = GameState.Created;
    // create a Board instance with the provided GameSettings
    this.board = new Board(settings);
    // initialize the round number and current player
    this.round = 0;
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = player1;
  }

  /**
   * Changes the currentPlayer property to the next player based on the current value.
   */
  private nextPlayer = (): void => {
    this.currentPlayer = this.currentPlayer === this.player1
      ? this.player2
      : this.player1;
  };

  /**
   * Initialize the game.
   * Throws an error if the Game is not in the Created state.
   * Puts the game into the Initialized state.
   * Will throw an error for inappropriate ship placements.
   *
   * @param p1Placement Ship placements for Player 1
   * @param p2Placement Ship placements for Player 2
   */
  initialize = (p1Placement: ShipPlacement[], p2Placement: ShipPlacement[]): void => {
    // Check that the current state is 'Created'
    if (this.state !== GameState.Created) {
      throw new Error('Game initialization error - game is already initialized');
    }

    // Place each players ships onto ther own grids
    this.board.placePlayer1Ships(p1Placement);
    this.board.placePlayer2Ships(p2Placement);

    // Set the Game state to 'Initialized'
    this.state = GameState.Initialized;
  };

  /**
   * Begin the game. Sets the Game state to 'InProgres'.
   * Throws an error if the current state is not 'Initialized'
   */
  start = (): void => {
    if (this.state !== GameState.Initialized) {
      throw new Error('Game error - cannot start game not in initialized state');
    }

    this.state = GameState.InProgress;
  };

  /**
   * Perform a move.
   * It has to be the specified Players turn, or this will throw an error.
   * If the aimed at cell is out of bounds, or it has already been hit
   * before an error will be thrown.
   * If the Game is not in the 'InProgress' state an error will be thrown.
   * In case any error was thrown, the round number is not advanced, and the
   * current player makes a move again.
   * If the result of the move is a Hit, the current player has another turn,
   * otherwise the opposing player makes their next move.
   *
   * @param player The name of the player making the move
   * @param x The x coordinate of the opposing players grid to hit
   * @param y The y coordinate of the opposing players grid to hit
   * @returns A MoveResult indicating the result of the move.
   */
  makeMove = (player: string, x: number, y: number): MoveResult => {
    // Check that the Game is in the appropriate state
    if (this.state !== GameState.InProgress) {
      throw new Error('Game error - game is not in progress');
    }

    // Check that it is the specified players move
    if (player !== this.currentPlayer) {
      throw new Error('Game error - not the players turn');
    }

    // Perform the cell hit - this will throw if coords are out of
    // bounds, or cell has already been hit
    const result = this.board.hitCell(
      player === this.player1 ? Player.Player1 : Player.Player2,
      x,
      y,
    );

    // Advance the round number
    this.round += 1;
    // If a hit is made, the current player gets another round, ...
    if (result !== MoveResult.Hit) {
      // .. otherwise move on to the next player
      this.nextPlayer();
    }

    return result;
  };

  /**
   * Set the Game into the Finished state.
   */
  finishGame = (): void => {
    this.state = GameState.Finished;
  };

  /**
   * Get the current Player
   *
   * @returns The current Player
   */
  getCurrentPlayer = (): string => this.currentPlayer;

  /**
   * Get the current Game state.
   *
   * @returns The current Game state
   */
  getGameState = (): GameState => this.state;

  /**
   * Get this Game's GameSettings
   *
   * @returns The GameSettings
   */
  getGameSettings = (): GameSetting => this.board.getSettings();
}

export default Game;
