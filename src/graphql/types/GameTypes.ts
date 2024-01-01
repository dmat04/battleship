import { ShipClassName, ShipOrientation } from '../../game/Ship';
import { GameSetting } from '../../game/GameSettings';

export const typeDefs = `#graphql
  enum ShipClassName {
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

  type ShipClass {
    type: ShipClassName!
    size: Int!
  }

  type ShipCount {
    class: ShipClassName!
    count: Int!
  }

  input ShipPlacement {
    shipClass: ShipClassName!
    orientation: ShipOrientation!
    x: Int!
    y: Int!
  }
  
  type GameSettings {
    boardWidth: Int!
    boardHeight: Int!
    shipClasses: [ShipClass!]!
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

interface ShipCount {
  class: ShipClassName;
  count: number;
}

interface IShipClass {
  type: ShipClassName;
  size: number;
}

export const resolvers = {
  GameSettings: {
    shipClasses: (root: GameSetting): IShipClass[] => {
      const arr: IShipClass[] = [];

      root.shipClasses.forEach((shipClass) => {
        arr.push({ ...shipClass });
      });

      return arr;
    },
    shipCounts: (root: GameSetting): ShipCount[] => {
      const arr: ShipCount[] = [];

      root.shipCounts.forEach((count, shipType) => {
        arr.push({ class: shipType, count });
      });

      return arr;
    },
  },
  ShipClassName: {
    SUBMARINE: ShipClassName[ShipClassName.Submarine],
    DESTROYER: ShipClassName[ShipClassName.Destroyer],
    CRUISER: ShipClassName[ShipClassName.Cruiser],
    BATTLESHIP: ShipClassName[ShipClassName.Battleship],
    CARRIER: ShipClassName[ShipClassName.AircraftCarrier],
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
