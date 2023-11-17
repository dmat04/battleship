import AuthService from '../../services/AuthService';
import type { LoginResult } from '../types/LoginResult';

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
    // eslint-disable-next-line arrow-body-style
    registerUser: async (_: any, args: MutationParams): Promise<LoginResult> => {
      return AuthService.registerUser(args.username, args.password);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
