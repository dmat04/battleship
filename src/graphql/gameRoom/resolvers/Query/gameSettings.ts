import { assertAuthorized } from '../../../../middleware/ApolloContext';
import type { QueryResolvers } from '../../../types.generated';
import GameService from '../../../../services/GameRoomService';

export const gameSettings: NonNullable<QueryResolvers['gameSettings']> = async (
  _parent,
  _arg,
  _ctx,
) => {
  assertAuthorized(_ctx);
  return GameService.getGameSettings(_arg.gameId);
};

export default gameSettings;
