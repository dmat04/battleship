import GameService from '../../services/GameRoomService';
import AuthService from '../../services/AuthService';
import { assertAuthorized, type ApolloContext } from '../../middleware/ApolloContext';
import { ShipPlacement } from '../../game/Ship';
import { GameRoomStatus } from '../../models/GameRoom';

interface MutationParams {
  roomID: string,
  shipPlacements: ShipPlacement[];
}

export const typeDefs = `#graphql
  extend type Mutation {
    placeShips(roomID: ID!, shipPlacements: [ShipPlacement!]!): GameRoomStatus!
  }
`;

export const resolvers = {
  Mutation: {
    placeShips: async (
      _: any,
      args: MutationParams,
      context: ApolloContext,
    ): Promise<GameRoomStatus> => {
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
