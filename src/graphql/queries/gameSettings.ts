import { GraphQLError } from 'graphql';
import GameService from '../../services/GameService';
import type { ApolloContext } from '../../middleware/ApolloMiddleware';
import EntityNotFoundError from '../../services/errors/EntityNotFoundError';

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

      try {
        const game = GameService.getGame(args.gameId);
        return game.getGameSettings();
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          throw new GraphQLError(`Game with id '${args.gameId}' not found.`, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        throw error;
      }
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
