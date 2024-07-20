import { ShipOrientation, ShipPlacementInput } from "@battleship/common/types/__generated__/types.generated";


export const p1Placements: ShipPlacementInput[] = [
  {
    shipID: "CARRIER-0",
    orientation: ShipOrientation.Vertical,
    x: 9,
    y: 1,
  },
  {
    shipID: "BATTLESHIP-0",
    orientation: ShipOrientation.Vertical,
    x: 7,
    y: 4,
  },
  {
    shipID: "CRUISER-0",
    orientation: ShipOrientation.Horizontal,
    x: 7,
    y: 9,
  },
  {
    shipID: "DESTROYER-0",
    orientation: ShipOrientation.Vertical,
    x: 1,
    y: 1,
  },
  {
    shipID: "DESTROYER-1",
    orientation: ShipOrientation.Horizontal,
    x: 3,
    y: 4,
  },
  {
    shipID: "SUBMARINE-0",
    orientation: ShipOrientation.Vertical,
    x: 3,
    y: 2,
  },
  {
    shipID: "SUBMARINE-1",
    orientation: ShipOrientation.Vertical,
    x: 0,
    y: 9,
  },
];

export const p2Placements: ShipPlacementInput[] = [
  {
    shipID: "CARRIER-0",
    orientation: ShipOrientation.Horizontal,
    x: 3,
    y: 9,
  },
  {
    shipID: "BATTLESHIP-0",
    orientation: ShipOrientation.Vertical,
    x: 8,
    y: 3,
  },
  {
    shipID: "CRUISER-0",
    orientation: ShipOrientation.Horizontal,
    x: 0,
    y: 0,
  },
  {
    shipID: "DESTROYER-0",
    orientation: ShipOrientation.Vertical,
    x: 0,
    y: 6,
  },
  {
    shipID: "DESTROYER-1",
    orientation: ShipOrientation.Horizontal,
    x: 0,
    y: 9,
  },
  {
    shipID: "SUBMARINE-0",
    orientation: ShipOrientation.Horizontal,
    x: 8,
    y: 1,
  },
  {
    shipID: "SUBMARINE-1",
    orientation: ShipOrientation.Horizontal,
    x: 9,
    y: 9,
  },
];

export const firstPlayer = "playerA";
export const secondPlayer = "playerB";

export const moves = [
  {
    player: "playerA",
    x: 0,
    y: 3,
    result: {
      x: 0,
      y: 3,
      hit: false,
      gameWon: false,
    },
  },
  {
    player: "playerB",
    x: 0,
    y: 0,
    result: {
      x: 0,
      y: 0,
      hit: false,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 0,
    y: 9,
    result: {
      x: 0,
      y: 9,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 1,
    y: 8,
    result: {
      x: 1,
      y: 8,
      hit: false,
      gameWon: false,
    },
  },
  {
    player: "playerB",
    x: 1,
    y: 0,
    result: {
      x: 1,
      y: 0,
      hit: false,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 2,
    y: 8,
    result: {
      x: 2,
      y: 8,
      hit: false,
      gameWon: false,
    },
  },
  {
    player: "playerB",
    x: 1,
    y: 1,
    result: {
      x: 1,
      y: 1,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerB",
    x: 1,
    y: 2,
    result: {
      x: 1,
      y: 2,
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: "DESTROYER-0",
          type: "DESTROYER",
          size: 2,
        },
        orientation: ShipOrientation.Vertical,
        x: 1,
        y: 1,
      },
    },
  },
  {
    player: "playerB",
    x: 3,
    y: 2,
    result: {
      x: 3,
      y: 2,
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: "SUBMARINE-0",
          type: "SUBMARINE",
          size: 1,
        },
        orientation: ShipOrientation.Vertical,
        x: 3,
        y: 2,
      },
    },
  },
  {
    player: "playerB",
    x: 3,
    y: 1,
    result: {
      x: 3,
      y: 1,
      hit: false,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 3,
    y: 8,
    result: {
      x: 3,
      y: 8,
      hit: false,
      gameWon: false,
    },
  },
  {
    player: "playerB",
    x: 3,
    y: 0,
    result: {
      x: 3,
      y: 0,
      hit: false,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 0,
    y: 0,
    result: {
      x: 0,
      y: 0,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 1,
    y: 0,
    result: {
      x: 1,
      y: 0,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 2,
    y: 0,
    result: {
      x: 2,
      y: 0,
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: "CRUISER-0",
          type: "CRUISER",
          size: 3,
        },
        orientation: ShipOrientation.Horizontal,
        x: 0,
        y: 0,
      },
    },
  },
  {
    player: "playerA",
    x: 8,
    y: 1,
    result: {
      x: 8,
      y: 1,
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: "SUBMARINE-0",
          type: "SUBMARINE",
          size: 1,
        },
        orientation: ShipOrientation.Horizontal,
        x: 8,
        y: 1,
      },
    },
  },
  {
    player: "playerA",
    x: 8,
    y: 3,
    result: {
      x: 8,
      y: 3,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 8,
    y: 4,
    result: {
      x: 8,
      y: 4,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 8,
    y: 5,
    result: {
      x: 8,
      y: 5,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 8,
    y: 6,
    result: {
      x: 8,
      y: 6,
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: "BATTLESHIP-0",
          type: "BATTLESHIP",
          size: 4,
        },
        orientation: ShipOrientation.Vertical,
        x: 8,
        y: 3,
      },
    },
  },
  {
    player: "playerA",
    x: 0,
    y: 6,
    result: {
      x: 0,
      y: 6,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 0,
    y: 7,
    result: {
      x: 0,
      y: 7,
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: "DESTROYER-0",
          type: "DESTROYER",
          size: 2,
        },
        orientation: ShipOrientation.Vertical,
        x: 0,
        y: 6,
      },
    },
  },
  {
    player: "playerA",
    x: 1,
    y: 9,
    result: {
      x: 1,
      y: 9,
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: "DESTROYER-1",
          type: "DESTROYER",
          size: 2,
        },
        orientation: ShipOrientation.Horizontal,
        x: 0,
        y: 9,
      },
    },
  },
  {
    player: "playerA",
    x: 4,
    y: 9,
    result: {
      x: 4,
      y: 9,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 5,
    y: 9,
    result: {
      x: 5,
      y: 9,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 6,
    y: 9,
    result: {
      x: 6,
      y: 9,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 7,
    y: 9,
    result: {
      x: 7,
      y: 9,
      hit: true,
      gameWon: false,
    },
  },
  {
    player: "playerA",
    x: 9,
    y: 9,
    result: {
      x: 9,
      y: 9,
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: "SUBMARINE-1",
          type: "SUBMARINE",
          size: 1,
        },
        orientation: ShipOrientation.Horizontal,
        x: 9,
        y: 9,
      },
    },
  },
  {
    player: "playerA",
    x: 3,
    y: 9,
    result: {
      x: 3,
      y: 9,
      hit: true,
      gameWon: true,
      shipSunk: {
        ship: {
          shipID: "CARRIER-0",
          type: "CARRIER",
          size: 5,
        },
        orientation: ShipOrientation.Horizontal,
        x: 3,
        y: 9,
      },
    },
  },
];
