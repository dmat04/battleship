import { GraphQLError } from 'graphql';
import AuthService from '../../services/AuthService';
import GameService from '../../services/GameService';
import type { GameCreatedResult } from '../types/GameCreatedResult';
import type { ApolloContext } from '../../middleware/ApolloMiddleware';

export const typeDefs = `#graphql
  extend type Mutation {
    createGameRoom: GameCreatedResult
  }
`;

export const resolvers = {
  Mutation: {
    createGameRoom: async (_: any, __: any, context: ApolloContext): Promise<GameCreatedResult> => {
      const accessToken = context.authToken;

      if (!accessToken) {
        throw new GraphQLError('Acess token missing in request header', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const user = await AuthService.getUserFromToken(accessToken);
      return GameService.createNewGame(user.username);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
