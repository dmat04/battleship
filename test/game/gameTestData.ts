import { ShipPlacement } from '../../src/graphql/types.generated';

export const p1Placements: ShipPlacement[] = [
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

export const p2Placements: ShipPlacement[] = [
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
      shipSunk: 'DESTROYER-0',
    },
  },
  {
    player: 'playerB',
    x: 3,
    y: 2,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: 'SUBMARINE-0',
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
      shipSunk: 'CRUISER-0',
    },
  },
  {
    player: 'playerA',
    x: 8,
    y: 1,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: 'SUBMARINE-0',
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
      shipSunk: 'BATTLESHIP-0',
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
      shipSunk: 'DESTROYER-0',
    },
  },
  {
    player: 'playerA',
    x: 1,
    y: 9,
    result: {
      hit: true,
      gameWon: false,
      shipSunk: 'DESTROYER-1',
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
      shipSunk: 'SUBMARINE-1',
    },
  },
  {
    player: 'playerA',
    x: 3,
    y: 9,
    result: {
      hit: true,
      gameWon: true,
      shipSunk: 'CARRIER-0',
    },
  },
];
