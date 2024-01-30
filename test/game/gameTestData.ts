import { ShipPlacement } from '../../src/graphql/types.generated';

export const p1Placements: ShipPlacement[] = [
  {
    ship: {
      shipID: '',
      type: 'CARRIER',
      size: 5,
    },
    orientation: 'VERTICAL',
    x: 9,
    y: 1,
  },
  {
    ship: {
      shipID: '',
      type: 'BATTLESHIP',
      size: 4,
    },
    orientation: 'VERTICAL',
    x: 7,
    y: 4,
  },
  {
    ship: {
      shipID: '',
      type: 'CRUISER',
      size: 3,
    },
    orientation: 'HORIZONTAL',
    x: 7,
    y: 9,
  },
  {
    ship: {
      shipID: '',
      type: 'DESTROYER',
      size: 2,
    },
    orientation: 'VERTICAL',
    x: 1,
    y: 1,
  },
  {
    ship: {
      shipID: '',
      type: 'DESTROYER',
      size: 2,
    },
    orientation: 'HORIZONTAL',
    x: 3,
    y: 4,
  },
  {
    ship: {
      shipID: '',
      type: 'SUBMARINE',
      size: 1,
    },
    orientation: 'VERTICAL',
    x: 3,
    y: 2,
  },
  {
    ship: {
      shipID: '',
      type: 'SUBMARINE',
      size: 1,
    },
    orientation: 'VERTICAL',
    x: 0,
    y: 9,
  },
];

export const p2Placements: ShipPlacement[] = [
  {
    ship: {
      shipID: '',
      type: 'CARRIER',
      size: 5,
    },
    orientation: 'HORIZONTAL',
    x: 3,
    y: 9,
  },
  {
    ship: {
      shipID: '',
      type: 'BATTLESHIP',
      size: 4,
    },
    orientation: 'VERTICAL',
    x: 8,
    y: 3,
  },
  {
    ship: {
      shipID: '',
      type: 'CRUISER',
      size: 3,
    },
    orientation: 'HORIZONTAL',
    x: 0,
    y: 0,
  },
  {
    ship: {
      shipID: '',
      type: 'DESTROYER',
      size: 2,
    },
    orientation: 'VERTICAL',
    x: 0,
    y: 6,
  },
  {
    ship: {
      shipID: '',
      type: 'DESTROYER',
      size: 2,
    },
    orientation: 'HORIZONTAL',
    x: 0,
    y: 9,
  },
  {
    ship: {
      shipID: '',
      type: 'SUBMARINE',
      size: 1,
    },
    orientation: 'HORIZONTAL',
    x: 8,
    y: 1,
  },
  {
    ship: {
      shipID: '',
      type: 'SUBMARINE',
      size: 1,
    },
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
          shipID: '',
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
          shipID: '',
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
          shipID: '',
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
          shipID: '',
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
          shipID: '',
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
          shipID: '',
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
          shipID: '',
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
          shipID: '',
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
          shipID: '',
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
