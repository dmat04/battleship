import AuthService from "../../../services/AuthService";
import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated";

export const registeredLogin: NonNullable<MutationResolvers["registeredLogin"]> = async (
  _,
  _arg,
) => AuthService.loginRegisteredUser(_arg.username, _arg.password);
