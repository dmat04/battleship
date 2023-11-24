import { GameState } from '../../game/Game';
import { GameSetting, ShipOrientation, ShipType } from '../../game/types';

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

  enum GameState {
    CREATED,
    INITIALIZED,
    IN_PROGRESS,
    FINISHED
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
  GameState: {
    CREATED: GameState[GameState.Created],
    INITIALIZED: GameState[GameState.Initialized],
    IN_PROGRESS: GameState[GameState.InProgress],
    FINISHED: GameState[GameState.Finished],
  },
};

export default {
  typeDefs,
  resolvers,
};
