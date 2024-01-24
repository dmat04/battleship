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

  input InputShipPlacement {
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
    SUBMARINE: ShipClassName[ShipClassName.SUBMARINE],
    DESTROYER: ShipClassName[ShipClassName.DESTROYER],
    CRUISER: ShipClassName[ShipClassName.CRUISER],
    BATTLESHIP: ShipClassName[ShipClassName.BATTLESHIP],
    CARRIER: ShipClassName[ShipClassName.CARRIER],
  },
  ShipOrientation: {
    VERTICAL: ShipOrientation[ShipOrientation.VERTICAL],
    HORIZONTAL: ShipOrientation[ShipOrientation.HORIZONTAL],
  },
};

export default {
  typeDefs,
  resolvers,
};
