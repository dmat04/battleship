import { GraphQLError } from 'graphql';
import GameService from '../../services/GameService';
import type { ApolloContext } from '../../middleware/ApolloMiddleware';

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
      const accessToken = context.authToken;

      if (!accessToken) {
        throw new GraphQLError('Acess token missing in request header', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const game = GameService.getGame(args.gameId);

      if (!game) {
        throw new GraphQLError(`Game with id '${args.gameId}' not found.`, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      return game.getGameSettings();
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
