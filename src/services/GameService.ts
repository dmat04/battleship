import { randomUUID } from 'crypto';

import Game from '../game/Game';
import { Player } from '../game/types';
import { DefaultSettings } from '../game/Board';
import type ActiveGame from '../models/ActiveGame';
import type { GameCreatedResult } from '../graphql/types/GameCreatedResult';

const activeGames: Map<string, ActiveGame> = new Map<string, ActiveGame>();
const inviteCodes: Map<string, string> = new Map<string, string>();

const generateGameId = (): string => {
  let id = randomUUID();

  while (activeGames.has(id)) {
    id = randomUUID();
  }

  return id;
};

const createInviteCode = (gameId: string): string => {
  let code = Math.floor((100_000 + Math.random() * 900_000)).toString();

  while (inviteCodes.has(code)) {
    code = Math.floor((100_000 + Math.random() * 900_000)).toString();
  }

  inviteCodes.set(code, gameId);

  return code;
};

const createNewGame = (user: string): GameCreatedResult => {
  const id = generateGameId();
  const inviteCode = createInviteCode(id);
  const gameInstance = new Game(Player.Player1, DefaultSettings);

  const game: ActiveGame = {
    id,
    userOwner: user,
    userP2: null,
    gameInstance,
  };

  activeGames.set(id, game);

  return {
    gameId: id,
    inviteCode,
  };
};

const gameExists = (id: string): boolean => activeGames.has(id);

export default {
  createNewGame,
  gameExists,
};
