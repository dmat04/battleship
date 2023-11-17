import AuthService from '../../services/AuthService';
import GameService from '../../services/GameService';
import { assertAuthorized, type ApolloContext } from '../../middleware/ApolloContext';
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
      const accessToken = assertAuthorized(context);

      const user = await AuthService.getUserFromToken(accessToken);
      return GameService.joinWithInviteCode(args.inviteCode, user);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
