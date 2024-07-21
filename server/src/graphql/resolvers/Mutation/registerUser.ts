import AuthService from "../../../services/AuthService";
import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated";

export const registerUser: NonNullable<MutationResolvers["registerUser"]> = async (
  _,
  _arg,
) => AuthService.registerUser(_arg.username, _arg.password);
