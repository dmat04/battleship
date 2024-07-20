import AuthService from "../../../services/AuthService";
import type { MutationResolvers } from "./../../__generated__/resolverTypes.generated";

export const guestLogin: NonNullable<MutationResolvers["guestLogin"]> = async (
  _,
  _arg,
) => AuthService.createGuestUserAndToken(_arg.username ?? null);
