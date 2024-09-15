import type { QueryResolvers } from "@battleship/common/types/__generated__/types.generated.js";
import UserService from "../../../services/UserService.js";
import { UserKind } from "@battleship/common/entities/UserDbModels.js";

export const checkRegisteredUsername: NonNullable<
  QueryResolvers["checkRegisteredUsername"]
> = async (_, _arg) => {
  return UserService.checkUsername(_arg.username, UserKind.RegisteredUser);
};
