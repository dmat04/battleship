import AuthService from '../../../../services/AuthService';
import type { MutationResolvers } from '../../../types.generated';

export const guestLogin: NonNullable<MutationResolvers['guestLogin']> = async (
  _,
  _arg,
) => AuthService.createGuestUserAndToken(_arg.username ?? null);

export default {};
