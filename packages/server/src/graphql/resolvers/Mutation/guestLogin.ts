import AuthService from "../../../services/AuthService.js";
import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated.js";

export const guestLogin: NonNullable<MutationResolvers["guestLogin"]> = async (
  _,
  _arg,
) => AuthService.createGuestUserAndToken(_arg.username ?? null);
