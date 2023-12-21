import GameService from '../../services/GameRoomService';
import AuthService from '../../services/AuthService';
import { assertAuthorized, type ApolloContext } from '../../middleware/ApolloContext';
import type { GameState } from '../../game/Game';
import { ShipPlacement } from '../../game/Ship';

interface MutationParams {
  roomID: string,
  shipPlacements: ShipPlacement[];
}

export const typeDefs = `#graphql
  extend type Mutation {
    placeShips(roomID: ID!, shipPlacements: [ShipPlacement!]!): GameState!
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
      return GameService.placeShips(user, args.roomID, args.shipPlacements);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
