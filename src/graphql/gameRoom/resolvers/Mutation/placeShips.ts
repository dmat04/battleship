import { assertAuthorized } from '../../../../middleware/ApolloContext';
import AuthService from '../../../../services/AuthService';
import GameService from '../../../../services/GameService';
import type { MutationResolvers } from '../../../types.generated';

export const placeShips: NonNullable<MutationResolvers['placeShips']> = async (
  _,
  _arg,
  _ctx,
) => {
  const accessToken = assertAuthorized(_ctx);

  const user = await AuthService.getUserFromToken(accessToken);

  return GameService.placeShips(user, _arg.roomID, _arg.shipPlacements);
};

export default {};
