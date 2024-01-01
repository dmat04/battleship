import GameService from '../../services/GameRoomService';
import AuthService from '../../services/AuthService';
import { assertAuthorized, type ApolloContext } from '../../middleware/ApolloContext';
import ShipClass, { ShipClassName, ShipPlacement } from '../../game/Ship';
import { GameRoomStatus } from '../../models/GameRoom';

type InputShipPlacement = Omit<ShipPlacement, 'shipClass'> & {
  shipClass: ShipClassName;
};

interface MutationParams {
  roomID: string,
  shipPlacements: InputShipPlacement[];
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
      const shipPlacements = args.shipPlacements.map((placement) => ({
        ...placement,
        shipClass: ShipClass.Get(placement.shipClass),
      }));

      return GameService.placeShips(user, args.roomID, shipPlacements);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
