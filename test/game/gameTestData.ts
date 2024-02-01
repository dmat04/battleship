import { ShipPlacementInput } from '../../src/graphql/types.generated';

export const p1Placements: ShipPlacementInput[] = [
  {
    shipID: 'CARRIER-0',
    orientation: 'VERTICAL',
    x: 9,
    y: 1,
  },
  {
    shipID: 'BATTLESHIP-0',
    orientation: 'VERTICAL',
    x: 7,
    y: 4,
  },
  {
    shipID: 'CRUISER-0',
    orientation: 'HORIZONTAL',
    x: 7,
    y: 9,
  },
  {
    shipID: 'DESTROYER-0',
    orientation: 'VERTICAL',
    x: 1,
    y: 1,
  },
  {
    shipID: 'DESTROYER-1',
    orientation: 'HORIZONTAL',
    x: 3,
    y: 4,
  },
  {
    shipID: 'SUBMARINE-0',
    orientation: 'VERTICAL',
    x: 3,
    y: 2,
  },
  {
    shipID: 'SUBMARINE-1',
    orientation: 'VERTICAL',
    x: 0,
    y: 9,
  },
];

export const p2Placements: ShipPlacementInput[] = [
  {
    shipID: 'CARRIER-0',
    orientation: 'HORIZONTAL',
    x: 3,
    y: 9,
  },
  {
    shipID: 'BATTLESHIP-0',
    orientation: 'VERTICAL',
    x: 8,
    y: 3,
  },
  {
    shipID: 'CRUISER-0',
    orientation: 'HORIZONTAL',
    x: 0,
    y: 0,
  },
  {
    shipID: 'DESTROYER-0',
    orientation: 'VERTICAL',
    x: 0,
    y: 6,
  },
  {
    shipID: 'DESTROYER-1',
    orientation: 'HORIZONTAL',
    x: 0,
    y: 9,
  },
  {
    shipID: 'SUBMARINE-0',
    orientation: 'HORIZONTAL',
    x: 8,
    y: 1,
  },
  {
    shipID: 'SUBMARINE-1',
    orientation: 'HORIZONTAL',
    x: 9,
    y: 9,
  },
];

export const firstPlayer = 'playerA';
export const secondPlayer = 'playerB';

export const moves = [
  {
    player: 'playerA',
    x: 0,
    y: 3,
    result: {
      hit: false,
      gameWon: false,
    },
  },
  {
    player: 'playerB',
    x: 0,
    y: 0,
    result: {
      hit: false,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 0,
    y: 9,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 1,
    y: 8,
    result: {
      hit: false,
      gameWon: false,
    },
  },
  {
    player: 'playerB',
    x: 1,
    y: 0,
    result: {
      hit: false,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 2,
    y: 8,
    result: {
      hit: false,
      gameWon: false,
    },
  },
  {
    player: 'playerB',
    x: 1,
    y: 1,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerB',
    x: 1,
    y: 2,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: 'DESTROYER-0',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'VERTICAL',
        x: 1,
        y: 1,
      },
    },
  },
  {
    player: 'playerB',
    x: 3,
    y: 2,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: 'SUBMARINE-0',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'VERTICAL',
        x: 3,
        y: 2,
      },
    },
  },
  {
    player: 'playerB',
    x: 3,
    y: 1,
    result: {
      hit: false,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 3,
    y: 8,
    result: {
      hit: false,
      gameWon: false,
    },
  },
  {
    player: 'playerB',
    x: 3,
    y: 0,
    result: {
      hit: false,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 0,
    y: 0,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 1,
    y: 0,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 2,
    y: 0,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: 'CRUISER-0',
          type: 'CRUISER',
          size: 3,
        },
        orientation: 'HORIZONTAL',
        x: 0,
        y: 0,
      },
    },
  },
  {
    player: 'playerA',
    x: 8,
    y: 1,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: 'SUBMARINE-0',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'HORIZONTAL',
        x: 8,
        y: 1,
      },
    },
  },
  {
    player: 'playerA',
    x: 8,
    y: 3,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 8,
    y: 4,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 8,
    y: 5,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 8,
    y: 6,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: 'BATTLESHIP-0',
          type: 'BATTLESHIP',
          size: 4,
        },
        orientation: 'VERTICAL',
        x: 8,
        y: 3,
      },
    },
  },
  {
    player: 'playerA',
    x: 0,
    y: 6,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 0,
    y: 7,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: 'DESTROYER-0',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'VERTICAL',
        x: 0,
        y: 6,
      },
    },
  },
  {
    player: 'playerA',
    x: 1,
    y: 9,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: 'DESTROYER-1',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 0,
        y: 9,
      },
    },
  },
  {
    player: 'playerA',
    x: 4,
    y: 9,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 5,
    y: 9,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 6,
    y: 9,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 7,
    y: 9,
    result: {
      hit: true,
      gameWon: false,
    },
  },
  {
    player: 'playerA',
    x: 9,
    y: 9,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: {
        ship: {
          shipID: 'SUBMARINE-1',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'HORIZONTAL',
        x: 9,
        y: 9,
      },
    },
  },
  {
    player: 'playerA',
    x: 3,
    y: 9,
    result: {
      hit: true,
      gameWon: true,
      shipSunk: {
        ship: {
          shipID: 'CARRIER-0',
          type: 'CARRIER',
          size: 5,
        },
        orientation: 'HORIZONTAL',
        x: 3,
        y: 9,
      },
    },
  },
];
