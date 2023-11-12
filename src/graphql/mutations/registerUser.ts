import { GraphQLError } from 'graphql';
import { LoginResult } from '../types/LoginResult';
import AuthService from '../../services/AuthService';
import ValidationError from '../../services/errors/ValidationError';

export interface MutationParams {
  username: string;
  password: string;
}

export const typeDefs = `#graphql
  extend type Mutation {
    registerUser(username: String!, password: String!): LoginResult
  }
`;

export const resolvers = {
  Mutation: {
    registerUser: async (_: any, args: MutationParams): Promise<LoginResult> => {
      try {
        const loginResult = await AuthService.registerUser(args.username, args.password);
        return {
          username: loginResult.username,
          accessToken: loginResult.token.token,
          expiresAt: loginResult.token.expiresAt.getTime().toString(),
        };
      } catch (e) {
        if (e instanceof ValidationError) {
          throw new GraphQLError(`User registration data invalid: ${e.message}`, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        throw new GraphQLError('An unknown error occured', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
