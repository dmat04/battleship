import { assertAuthorized } from "@battleship/common/utils/ApolloContext.js";
import AuthService from "../../../services/AuthService.js";
import GameService from "../../../services/GameService.js";
import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated.js";

export const placeShips: NonNullable<MutationResolvers["placeShips"]> = async (
  _,
  _arg,
  _ctx,
) => {
  const accessToken = assertAuthorized(_ctx);

  const user = await AuthService.getUserFromToken(accessToken);

  return GameService.placeShips(user, _arg.roomID, _arg.shipPlacements);
};
