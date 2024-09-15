import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated.js";
import UserService from "../../../services/UserService.js";
import SessionService from "../../../services/SessionService.js";

export const registerUser: NonNullable<
  MutationResolvers["registerUser"]
> = async (_, _arg) => {
  const user = await UserService.createRegisteredUser(_arg.username, _arg.password, _arg.email);
  return SessionService.loginUser(user);
}
