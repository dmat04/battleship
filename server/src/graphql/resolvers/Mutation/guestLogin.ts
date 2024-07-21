import AuthService from "../../../services/AuthService";
import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated";

export const guestLogin: NonNullable<MutationResolvers["guestLogin"]> = async (
  _,
  _arg,
) => AuthService.createGuestUserAndToken(_arg.username ?? null);
