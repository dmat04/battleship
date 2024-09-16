import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated.js";
import UserService from "../../../services/UserService.js";
import SessionService from "../../../services/SessionService.js";

export const registeredLogin: NonNullable<
  MutationResolvers["registeredLogin"]
> = async (_, _arg) => {
  const user = await UserService.authenticateRegisteredUser(
    _arg.username,
    _arg.password,
  );
  return SessionService.loginUser(user);
};
