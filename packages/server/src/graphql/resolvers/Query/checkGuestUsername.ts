import type { QueryResolvers } from "@battleship/common/types/__generated__/types.generated.js";
import UserService from "../../../services/UserService.js";
import { UserKind } from "@battleship/common/entities/UserDbModels.js";

export const checkGuestUsername: NonNullable<
  QueryResolvers["checkGuestUsername"]
> = async (_, _arg) => {
  return UserService.checkUsername(_arg.username, UserKind.GuestUser);
};
