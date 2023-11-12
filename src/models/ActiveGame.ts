import Game from '../game/Game';

interface ActiveGame {
  readonly id: string;
  userOwner: string;
  userP2: string | null;
  readonly gameInstance: Game;
}

export default ActiveGame;
