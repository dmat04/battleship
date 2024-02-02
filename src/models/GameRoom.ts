import { WebSocket } from 'uWebSockets.js';
import type { User } from './User';
import type { WSData } from './WSData';
import Game from '../game/Game';
import { GameSettings, ShipPlacementInput } from '../graphql/types.generated';

export interface PlayerData {
  readonly user: User;
  shipPlacements?: ShipPlacementInput[];
  socket?: WebSocket<WSData>;
}

export interface ActivePlayerData extends PlayerData {
  shipPlacements: ShipPlacementInput[];
  socket: WebSocket<WSData>;
}

export interface GameRoom {
  readonly id: string;
  readonly gameSettings: GameSettings;
  readonly player1: PlayerData;
  player2?: PlayerData;
  gameInstance?: Game;
  turnTimer?: NodeJS.Timeout;
}

export interface ActiveGameRoom extends GameRoom {
  player1: ActivePlayerData;
  player2: ActivePlayerData;
  gameInstance: Game;
  turnTimer: NodeJS.Timeout;
}

export const getPlayerData = (room: GameRoom, player: string): {
  playerData: PlayerData | undefined,
  opponentData?: PlayerData | undefined,
} => {
  let playerData: PlayerData | undefined;
  let opponentData: PlayerData | undefined;

  if (player === room.player1.user.username) {
    playerData = room.player1;
    opponentData = room.player2;
  }

  if (player === room.player2?.user.username) {
    playerData = room.player2;
    opponentData = room.player2;
  }

  return {
    playerData,
    opponentData,
  };
};

export const getActivePlayerData = (room: ActiveGameRoom, player: string): {
  playerData: ActivePlayerData,
  opponentData: ActivePlayerData,
} => {
  if (player === room.player1.user.username) {
    return {
      playerData: room.player1,
      opponentData: room.player2,
    };
  }

  return {
    playerData: room.player2,
    opponentData: room.player1,
  };
};

/**
 * Checks whether a game room has all of its missing components
 * initialized (an opponent player, both of the players ship
 * placements and websocket connections).
 *
 * @param room The GameRoom to be checked
 * @returns true if the given GameRoom has all of its components initialized and can
 *          be cast to an ActiveGameRoom object.
 */
export const gameRoomIsActive = (room: GameRoom): room is ActiveGameRoom => (
  room.gameInstance !== undefined
  && room.player1.shipPlacements !== undefined
  && room.player1.socket !== undefined
  && room.player2?.shipPlacements !== undefined
  && room.player2?.socket !== undefined
);
