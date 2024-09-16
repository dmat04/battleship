import type { QueryResolvers } from "@battleship/common/types/__generated__/types.generated.js";
import UserService from "../../../services/UserService.js";

export const checkUsername: NonNullable<
  QueryResolvers["checkUsername"]
> = async (_, _arg) => {
  return UserService.checkUsername(_arg.username, _arg.userKind);
};
