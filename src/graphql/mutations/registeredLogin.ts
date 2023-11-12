import { GraphQLError } from 'graphql';
import AuthService from '../../services/AuthService';
import EntityNotFoundError from '../../services/errors/EntityNotFoundError';
import AuthenticationError from '../../services/errors/AuthenticationError';
import type { LoginResult } from '../types/LoginResult';

export interface MutationParams {
  username: string;
  password: string;
}

export const typeDefs = `#graphql
  extend type Mutation {
    registeredLogin(username: String!, password: String!): LoginResult
  }
`;

export const resolvers = {
  Mutation: {
    registeredLogin: async (_: any, args: MutationParams): Promise<LoginResult> => {
      try {
        return await AuthService.loginRegisteredUser(args.username, args.password);
      } catch (e) {
        if (e instanceof EntityNotFoundError) {
          throw new GraphQLError(`User with username '${args.username}' not found.`, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        } else if (e instanceof AuthenticationError) {
          throw new GraphQLError('Incorrect password', {
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
