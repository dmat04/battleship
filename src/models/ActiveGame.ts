import Game from '../game/Game';
import { ShipPlacement } from '../game/types';
import { User } from './User';

interface ActiveGame {
  readonly id: string;
  userOwner: User;
  userP2: User | null;
  readonly gameInstance: Game;
  ownerPlacements: ShipPlacement[] | null;
  p2Placements: ShipPlacement[] | null;
}

export default ActiveGame;
