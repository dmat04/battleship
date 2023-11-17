import { GraphQLError } from 'graphql';
import AuthService from '../../services/AuthService';
import GameService from '../../services/GameService';
import type { ApolloContext } from '../../middleware/ApolloContext';
import { GameJoinedResult } from '../types/GameJoinedResult';

interface MutationParams {
  inviteCode: string;
}

export const typeDefs = `#graphql
  extend type Mutation {
    joinGame(inviteCode: String!): GameJoinedResult!
  }
`;

export const resolvers = {
  Mutation: {
    joinGame: async (
      _: any,
      args: MutationParams,
      context: ApolloContext,
    ): Promise<GameJoinedResult> => {
      const accessToken = context.authToken;

      if (!accessToken) {
        throw new GraphQLError('Acess token missing in request header', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const user = await AuthService.getUserFromToken(accessToken);
      return GameService.joinWithInviteCode(args.inviteCode, user);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
