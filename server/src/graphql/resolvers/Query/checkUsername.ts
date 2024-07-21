import AuthService from "../../../services/AuthService";
import type { QueryResolvers } from "@battleship/common/types/__generated__/types.generated";

export const checkUsername: NonNullable<
  QueryResolvers["checkUsername"]
> = async (_parent, _arg) => AuthService.checkUsername(_arg.username);
