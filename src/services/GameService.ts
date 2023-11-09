import { randomUUID } from 'crypto';
import Game from '../game/Game';
import { Player } from '../game/types';
import { DefaultSettings } from '../game/Board';

const ActiveGames: Map<string, Game> = new Map<string, Game>();

const createNewGame = (): string => {
  let id = randomUUID();
  const game = new Game(Player.Player1, DefaultSettings);

  while (ActiveGames.has(id)) {
    id = randomUUID();
  }

  ActiveGames.set(id, game);
  return id;
};

const gameExists = (id: string): boolean => ActiveGames.has(id);

export default {
  createNewGame,
  gameExists,
};
