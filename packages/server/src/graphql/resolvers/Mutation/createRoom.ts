import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated.js";
import { assertAuthorized } from "../../../middleware/ApolloAuthMiddleware.js";
import SessionService from "../../../services/SessionService.js";
import GameService from "../../../services/GameService.js";

export const createRoom: NonNullable<MutationResolvers["createRoom"]> = async (
  _,
  _arg,
  _ctx,
) => {
  const session = assertAuthorized(_ctx);
  const user = await SessionService.getUserFromSession(session);
  return GameService.createNewRoom(user);
};
