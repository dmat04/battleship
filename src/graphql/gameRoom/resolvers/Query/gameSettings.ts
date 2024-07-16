import { assertAuthorized } from '../../../../middleware/ApolloContext';
import type { QueryResolvers } from '../../../types.generated';
import GameService from '../../../../services/GameService';

export const gameSettings: NonNullable<QueryResolvers['gameSettings']> = async (
  _,
  _arg,
  _ctx,
) => {
  assertAuthorized(_ctx);
  return GameService.getGameSettings(_arg.gameId);
};

export default {};
