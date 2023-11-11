import { GraphQLError } from 'graphql';
import { GuestLoginResult } from '../types/GuestLoginResult';
import AuthService from '../../services/AuthService';
import ValidationError from '../../services/errors/ValidationError';

export interface MutationParams {
  username: string | undefined;
}

export const typeDefs = `#graphql
  extend type Mutation {
    guestLogin(username: String): GuestLoginResult
  }
`;

export const resolvers = {
  Mutation: {
    guestLogin: async (_: any, args: MutationParams): Promise<GuestLoginResult> => {
      try {
        const guest = await AuthService.createGuestUserAndToken(args.username);
        return {
          accessToken: guest.token.token,
          expiresAt: guest.token.expiresAt.getTime().toString(),
          username: guest.username,
        };
      } catch (e) {
        if (e instanceof ValidationError) {
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
