import { assertAuthorized } from "@battleship/common/utils/ApolloContext.js";
import GameService from "../../../services/GameService.js";
import type { QueryResolvers } from "@battleship/common/types/__generated__/types.generated.js";

export const gameSettings: NonNullable<QueryResolvers["gameSettings"]> = (
  _,
  _arg,
  _ctx,
) => {
  assertAuthorized(_ctx);
  return GameService.getGameSettings(_arg.gameId);
};
