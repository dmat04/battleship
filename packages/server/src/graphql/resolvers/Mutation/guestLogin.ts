import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated.js";
import UserService from "../../../services/UserService.js";
import SessionService from "../../../services/SessionService.js";

export const guestLogin: NonNullable<MutationResolvers["guestLogin"]> = async (
  _,
  _arg,
) => {
  const user = await UserService.createGuestUser(_arg.username);
  return SessionService.loginUser(user);
}
