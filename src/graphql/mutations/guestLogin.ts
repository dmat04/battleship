import { GraphQLError } from 'graphql';
import { GuestUser } from '../types/GuestUser';
import AuthService, { UsernameValidationError } from '../../services/AuthService';

export interface MutationParams {
  username: string | undefined;
}

export const typeDefs = `#graphql
  extend type Mutation {
    guestLogin(username: String): GuestUser
  }
`;

export const resolvers = {
  Mutation: {
    guestLogin: async (_: any, args: MutationParams): Promise<GuestUser> => {
      try {
        const guest = await AuthService.createGuestUserAndToken(args.username);
        return {
          accessToken: guest.token.token,
          expiresAt: guest.token.expiresAt.getTime().toString(),
          username: guest.username,
        }
      } catch (e) {
        if (e instanceof UsernameValidationError) {
          throw new GraphQLError(`Username validation error: ${e.message}`, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        } else {
          throw new GraphQLError('An unknown error occured', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          });
        }
      }
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
