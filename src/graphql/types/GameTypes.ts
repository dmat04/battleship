import { ShipType, ShipOrientation } from '../../game/Ship';
import { GameSetting } from '../../game/types';

export const typeDefs = `#graphql
  enum ShipType {
    SUBMARINE
    DESTROYER
    CRUISER
    BATTLESHIP
    CARRIER
  }

  enum ShipOrientation {
    VERTICAL
    HORIZONTAL
  }

  type ShipCount {
    shipType: ShipType!
    count: Int!
  }

  input ShipPlacement {
    shipType: ShipType!
    orientation: ShipOrientation!
    x: Int!
    y: Int!
  }
  
  type GameSettings {
    boardWidth: Int!
    boardHeight: Int!
    shipCounts: [ShipCount!]!
  }

  type GameRoomStatus {
    player1: String!
    player2: String
    p1WSOpen: Boolean!
    p2WSOpen: Boolean!
    p1ShipsPlaced: Boolean!
    p2ShipsPlaced: Boolean!
    currentPlayer: String
}
`;

export const resolvers = {
  GameSettings: {
    shipCounts: (root: GameSetting) => {
      const arr: { shipType: ShipType, count: number }[] = [];

      root.shipCounts.forEach((count, shipType) => {
        arr.push({ shipType, count });
      });

      return arr;
    },
  },
  ShipType: {
    SUBMARINE: ShipType[ShipType.Submarine],
    DESTROYER: ShipType[ShipType.Destroyer],
    CRUISER: ShipType[ShipType.Cruiser],
    BATTLESHIP: ShipType[ShipType.Battleship],
    CARRIER: ShipType[ShipType.AircraftCarrier],
  },
  ShipOrientation: {
    VERTICAL: ShipOrientation[ShipOrientation.Vertical],
    HORIZONTAL: ShipOrientation[ShipOrientation.Horizontal],
  },
};

export default {
  typeDefs,
  resolvers,
};
