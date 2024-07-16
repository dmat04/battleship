import { assertAuthorized } from '../../../../middleware/ApolloContext';
import AuthService from '../../../../services/AuthService';
import GameService from '../../../../services/GameService';
import type { MutationResolvers } from '../../../types.generated';

export const createRoom: NonNullable<MutationResolvers['createRoom']> = async (
  _,
  _arg,
  _ctx,
) => {
  const accessToken = assertAuthorized(_ctx);

  const user = await AuthService.getUserFromToken(accessToken);
  return GameService.createNewRoom(user);
};

export default {};
