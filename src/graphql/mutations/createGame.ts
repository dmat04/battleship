import { GraphQLError } from 'graphql';
import AuthService from '../../services/AuthService';
import GameService from '../../services/GameService';
import type { GameCreatedResult } from '../types/GameCreatedResult';
import { ApolloContext } from '../../middleware/ApolloContext';

export const typeDefs = `#graphql
  extend type Mutation {
    createGame: GameCreatedResult!
  }
`;

export const resolvers = {
  Mutation: {
    createGame: async (_: any, __: any, context: ApolloContext): Promise<GameCreatedResult> => {
      const accessToken = context.authToken;

      if (!accessToken) {
        throw new GraphQLError('Acess token missing in request header', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const user = await AuthService.getUserFromToken(accessToken);
      return GameService.createNewGame(user);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
