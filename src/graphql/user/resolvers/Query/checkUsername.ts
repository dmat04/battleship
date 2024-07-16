import AuthService from '../../../../services/AuthService';
import type { QueryResolvers } from '../../../types.generated';

export const checkUsername: NonNullable<QueryResolvers['checkUsername']> = async (
  _,
  _arg,
) => AuthService.checkUsername(_arg.username);

export default {};
