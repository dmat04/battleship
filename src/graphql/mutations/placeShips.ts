import GameService from '../../services/GameService';
import AuthService from '../../services/AuthService';
import { ShipPlacement } from '../../game/types';
import { assertAuthorized, type ApolloContext } from '../../middleware/ApolloContext';
import type { GameState } from '../../game/Game';

interface MutationParams {
  gameId: string,
  shipPlacements: ShipPlacement[];
}

export const typeDefs = `#graphql
  extend type Mutation {
    placeShips(gameId: ID!, shipPlacements: [ShipPlacement!]!): GameState!
  }
`;

export const resolvers = {
  Mutation: {
    placeShips: async (
      _: any,
      args: MutationParams,
      context: ApolloContext,
    ): Promise<GameState> => {
      const accessToken = assertAuthorized(context);

      const user = await AuthService.getUserFromToken(accessToken);
      return GameService.placeShips(user, args.gameId, args.shipPlacements);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
