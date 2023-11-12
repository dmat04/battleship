import { GraphQLError } from 'graphql';
import { LoginResult } from '../types/LoginResult';
import AuthService from '../../services/AuthService';
import ValidationError from '../../services/errors/ValidationError';

export interface MutationParams {
  username: string | undefined;
}

export const typeDefs = `#graphql
  extend type Mutation {
    guestLogin(username: String): LoginResult
  }
`;

export const resolvers = {
  Mutation: {
    guestLogin: async (_: any, args: MutationParams): Promise<LoginResult> => {
      try {
        const guest = await AuthService.createGuestUserAndToken(args.username);
        return {
          username: guest.username,
          accessToken: guest.token.token,
          expiresAt: guest.token.expiresAt.getTime().toString(),
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
