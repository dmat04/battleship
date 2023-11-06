import Board, { DefaultSettings } from './Board';
import {
  GameSetting, ShipPlacement, Player, MoveResult,
} from './types';

export enum GameState {
  Created = 'created',
  Initialized = 'initialized',
  InProgress = 'inProgress',
  Finished = 'finished',
}

class Game {
  private state: GameState;

  private readonly board: Board;

  private round: number;

  private currentPlayer: Player;

  constructor(firstPlayer: Player, settings: GameSetting = DefaultSettings) {
    this.state = GameState.Created;
    this.board = new Board(settings);
    this.round = 0;
    this.currentPlayer = firstPlayer;
  }

  private nextPlayer = (): void => {
    this.currentPlayer = this.currentPlayer === Player.Player1
      ? Player.Player2
      : Player.Player1;
  };

  initialize = (p1Placement: ShipPlacement[], p2Placement: ShipPlacement[]): void => {
    if (this.state !== GameState.Created) {
      throw new Error('Game initialization error - game is already initialized');
    }

    this.board.placePlayer1Ships(p1Placement);
    this.board.placePlayer2Ships(p2Placement);

    this.state = GameState.Initialized;
  };

  start = (): void => {
    if (this.state !== GameState.Initialized) {
      throw new Error('Game error - cannot start game not in initialized state');
    }

    this.state = GameState.InProgress;
  };

  makeMove = (player: Player, x: number, y: number): MoveResult => {
    if (this.state !== GameState.InProgress) {
      throw new Error('Game error - game is not in progress');
    }

    if (player !== this.currentPlayer) {
      throw new Error('Game error - not the players turn');
    }

    const result = this.board.hitCell(player, x, y);

    this.round += 1;
    if (result !== MoveResult.Hit) {
      this.nextPlayer();
    }

    return result;
  };

  finishGame = (): void => {
    this.state = GameState.Finished;
  };

  getCurrentPlayer = (): Player => this.currentPlayer;

  getGameState = (): GameState => this.state;
}

export default Game;
