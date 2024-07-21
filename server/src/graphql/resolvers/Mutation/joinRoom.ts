import { assertAuthorized } from "@battleship/common/utils/ApolloContext";
import AuthService from "../../../services/AuthService";
import GameService from "../../../services/GameService";
import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated";

export const joinRoom: NonNullable<MutationResolvers["joinRoom"]> = async (
  _,
  _arg,
  _ctx,
) => {
  const accessToken = assertAuthorized(_ctx);

  const user = await AuthService.getUserFromToken(accessToken);
  return GameService.joinWithInviteCode(_arg.inviteCode, user);
};
