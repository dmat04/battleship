import { assertAuthorized } from "@battleship/common/utils/ApolloContext";
import GameService from "../../../services/GameService";
import type { QueryResolvers } from "./../../__generated__/resolverTypes.generated";

export const gameSettings: NonNullable<QueryResolvers["gameSettings"]> = (
  _,
  _arg,
  _ctx,
) => {
  assertAuthorized(_ctx);
  return GameService.getGameSettings(_arg.gameId);
};
