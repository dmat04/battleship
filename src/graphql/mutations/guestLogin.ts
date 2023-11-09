import { GraphQLError } from 'graphql';
import AuthService, { GuestUserWithToken, UsernameTakenError } from '../../services/AuthService';

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
    guestLogin: (_: any, args: MutationParams): GuestUserWithToken => {
      try {
        return AuthService.createGuestUser(args.username);
      } catch (e) {
        if (e instanceof UsernameTakenError) {
          throw new GraphQLError(`Username ${e.username} is taken`, {
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
