import AuthService from '../../services/AuthService';
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
    // eslint-disable-next-line arrow-body-style
    guestLogin: async (_: any, args: MutationParams): Promise<LoginResult> => {
      return AuthService.createGuestUserAndToken(args.username);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
