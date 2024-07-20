import AuthService from "../../../services/AuthService";
import type { QueryResolvers } from "./../../__generated__/resolverTypes.generated";

export const checkUsername: NonNullable<
  QueryResolvers["checkUsername"]
> = async (_parent, _arg) => AuthService.checkUsername(_arg.username);
