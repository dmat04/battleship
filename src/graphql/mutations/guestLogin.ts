import { GraphQLError } from 'graphql';
import AuthService from '../../services/AuthService';
import ValidationError from '../../services/errors/ValidationError';
import type { LoginResult } from '../types/LoginResult';

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
        return await AuthService.createGuestUserAndToken(args.username);
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
