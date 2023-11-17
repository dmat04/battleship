import { ApolloContext, assertAuthorized } from '../../middleware/ApolloContext';
import GameService from '../../services/GameService';

interface MutationParams {
  gameId: string;
}

export const typeDefs = `#graphql
  extend type Query {
    gameSettings(gameId: ID!): GameSettings!
  }
`;

export const resolvers = {
  Query: {
    gameSettings: (_: any, args: MutationParams, context: ApolloContext) => {
      assertAuthorized(context);
      return GameService.getGameSettings(args.gameId);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
