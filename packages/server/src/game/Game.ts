
import {
  GameSettings,
  ShipPlacementInput,
} from "@battleship/common/types/__generated__/types.generated.js";
import { CellHitResult } from "@battleship/common/types/GameTypes.js";
import GameplayError from "./GameplayError.js";
import DefaultSettings from "./DefaultSettings.js";
import Board, { Player } from "./Board.js";

export enum GameState {
  Created = "Created",
  Initialized = "Initialized",
  InProgress = "InProgress",
  Finished = "Finished",
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

  // The player making the first move
  private playsFirst: string | null = null;

  // The current player - the player who can make the next move
  private currentPlayerID: string;

  private player1ID: string;

  private player2ID: string;

  /**
   * Game constructor.
   *
   * @param player1ID Id of Player 1 (makes the first move)
   * @param player2ID Id of Player 2
   * @param settings The GameSettings which will dictate the Board dimension and
   *                 the numbers of available ships
   */
  constructor(
    player1ID: string,
    player2ID: string,
    settings: GameSettings = DefaultSettings,
  ) {
    // set the initial state to Created
    this.state = GameState.Created;
    // create a Board instance with the provided GameSettings
    this.board = new Board(settings);
    // initialize the round number and current player
    this.round = 0;
    this.player1ID = player1ID;
    this.player2ID = player2ID;
    this.currentPlayerID = player1ID;
    this.playsFirst = player1ID;
  }

  /**
   * Check that the given player id may perform a move.
   * Throws if the game state is not 'InProgress' or it isn't
   * the specified players turn.
   */
  private assertCanMakeMove = (playerID: string): void => {
    // Check that the Game is in the appropriate state
    if (this.state !== GameState.InProgress) {
      throw new Error("Game error - game is not in progress");
    }

    // Check that it is the specified players move
    if (playerID !== this.currentPlayerID) {
      throw new GameplayError("Game error - not the players turn");
    }
  };

  /**
   * Advance the round counter and change the current player after a move is made.
   * If the move was a hit, the current player is not changed, the current player
   * gets another move.
   *
   * @param moveResult The MoveResult resulting from the made move.
   */
  private advanceRound = (moveResult: CellHitResult): void => {
    // Advance the round number
    this.round += 1;
    // If a hit is made, the current player gets another round, ...
    if (!moveResult.hit) {
      // .. otherwise move on to the next player
      this.currentPlayerID =
        this.currentPlayerID === this.player1ID ? this.player2ID : this.player1ID;
    }
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
  initialize = (
    p1Placement: ShipPlacementInput[],
    p2Placement: ShipPlacementInput[],
  ): void => {
    // Check that the current state is 'Created'
    if (this.state !== GameState.Created) {
      throw new Error(
        "Game initialization error - game is already initialized",
      );
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
      throw new Error(
        "Game error - cannot start game not in initialized state",
      );
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
   * @param playerID The id of the player making the move
   * @param x The x coordinate of the opposing players grid to hit
   * @param y The y coordinate of the opposing players grid to hit
   * @returns A MoveResult indicating the result of the move.
   */
  makeMove = (playerID: string, x: number, y: number): CellHitResult => {
    this.assertCanMakeMove(playerID);

    // Perform the cell hit - this will throw if coords are out of
    // bounds, or cell has already been hit
    const result = this.board.hitCell(
      playerID === this.player1ID ? Player.Player1 : Player.Player2,
      x,
      y,
    );

    this.advanceRound(result);

    if (result.gameWon) this.finishGame();

    return result;
  };

  makeRandomMove = (playerID: string): CellHitResult => {
    this.assertCanMakeMove(playerID);

    // Perform the cell hit
    const result = this.board.hitRandomCell(
      playerID === this.player1ID ? Player.Player1 : Player.Player2,
    );

    this.advanceRound(result);

    if (result.gameWon) this.finishGame();

    return result;
  };

  /**
   * Set the Game into the Finished state.
   */
  finishGame = (): void => {
    this.state = GameState.Finished;
  };

  /**
   * Reset this Game instance. Sets the Game into the 'Created' state.
   * Switches the player making the first move. After this, the game may be
   * initialized and started again;
   */
  resetGame = (): void => {
    this.board.reset();
    this.state = GameState.Created;
    this.round = 0;
    this.playsFirst =
      this.playsFirst === this.player1ID ? this.player2ID : this.player1ID;
    this.currentPlayerID = this.playsFirst;
  };

  /**
   * Get the current Player
   *
   * @returns The current Player
   */
  getCurrentPlayer = (): string => this.currentPlayerID;

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
  getGameSettings = (): GameSettings => this.board.getSettings();
}

export default Game;
