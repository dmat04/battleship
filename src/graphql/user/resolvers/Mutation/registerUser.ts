import AuthService from '../../../../services/AuthService';
import type { MutationResolvers } from '../../../types.generated';

export const registerUser: NonNullable<MutationResolvers['registerUser']> = async (
  _,
  _arg,
) => AuthService.registerUser(_arg.username, _arg.password);

export default {};
