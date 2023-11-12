import Game from '../game/Game';
import { User } from './User';

interface ActiveGame {
  readonly id: string;
  userOwner: User;
  userP2: User | null;
  readonly gameInstance: Game;
}

export default ActiveGame;
