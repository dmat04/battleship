import { ShipPlacement } from '../../src/graphql/types.generated';

interface PlacementTestData {
  populatedCells: number,
  placements: ShipPlacement[],
}

export const validPlacements: PlacementTestData[] = [
  {
    populatedCells: 18,
    placements: [
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
    ],
  },
  {
    populatedCells: 18,
    placements: [
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
        x: 9,
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
    ],
  },
];

export const invalidPlacements: PlacementTestData[] = [
  {
    populatedCells: 18,
    placements: [
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
        x: 8,
        y: 8,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        ship: {
          shipID: '',
          type: 'CARRIER',
          size: 5,
        },
        orientation: 'HORIZONTAL',
        x: 5,
        y: 9,
      },
      {
        ship: {
          shipID: '',
          type: 'BATTLESHIP',
          size: 4,
        },
        orientation: 'HORIZONTAL',
        x: 0,
        y: 9,
      },
      {
        ship: {
          shipID: '',
          type: 'CRUISER',
          size: 3,
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
        orientation: 'VERTICAL',
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
        y: 4,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'VERTICAL',
        x: 4,
        y: 9,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'VERTICAL',
        x: 0,
        y: 2,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        ship: {
          shipID: '',
          type: 'CARRIER',
          size: 5,
        },
        orientation: 'HORIZONTAL',
        x: 4,
        y: 0,
      },
      {
        ship: {
          shipID: '',
          type: 'BATTLESHIP',
          size: 4,
        },
        orientation: 'VERTICAL',
        x: 9,
        y: 6,
      },
      {
        ship: {
          shipID: '',
          type: 'CRUISER',
          size: 3,
        },
        orientation: 'VERTICAL',
        x: 9,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'VERTICAL',
        x: 9,
        y: 1,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 0,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'VERTICAL',
        x: 1,
        y: 0,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'VERTICAL',
        x: 9,
        y: 0,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        ship: {
          shipID: '',
          type: 'CARRIER',
          size: 5,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 4,
      },
      {
        ship: {
          shipID: '',
          type: 'BATTLESHIP',
          size: 4,
        },
        orientation: 'HORIZONTAL',
        x: 3,
        y: 5,
      },
      {
        ship: {
          shipID: '',
          type: 'CRUISER',
          size: 3,
        },
        orientation: 'VERTICAL',
        x: 7,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 5,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'HORIZONTAL',
        x: 4,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 5,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
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
        y: 6,
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
        x: 8,
        y: 8,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        ship: {
          shipID: '',
          type: 'CARRIER',
          size: 5,
        },
        orientation: 'HORIZONTAL',
        x: 6,
        y: 9,
      },
      {
        ship: {
          shipID: '',
          type: 'BATTLESHIP',
          size: 4,
        },
        orientation: 'HORIZONTAL',
        x: 0,
        y: 9,
      },
      {
        ship: {
          shipID: '',
          type: 'CRUISER',
          size: 3,
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
        orientation: 'VERTICAL',
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
        y: 4,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'VERTICAL',
        x: 4,
        y: 9,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'VERTICAL',
        x: 0,
        y: 2,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        ship: {
          shipID: '',
          type: 'CARRIER',
          size: 5,
        },
        orientation: 'HORIZONTAL',
        x: 4,
        y: 0,
      },
      {
        ship: {
          shipID: '',
          type: 'BATTLESHIP',
          size: 4,
        },
        orientation: 'VERTICAL',
        x: 9,
        y: 7,
      },
      {
        ship: {
          shipID: '',
          type: 'CRUISER',
          size: 3,
        },
        orientation: 'VERTICAL',
        x: 9,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'VERTICAL',
        x: 9,
        y: 1,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 0,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'VERTICAL',
        x: 1,
        y: 0,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'VERTICAL',
        x: 9,
        y: 0,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        ship: {
          shipID: '',
          type: 'CARRIER',
          size: 5,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 4,
      },
      {
        ship: {
          shipID: '',
          type: 'BATTLESHIP',
          size: 4,
        },
        orientation: 'HORIZONTAL',
        x: 3,
        y: 5,
      },
      {
        ship: {
          shipID: '',
          type: 'CRUISER',
          size: 3,
        },
        orientation: 'VERTICAL',
        x: 7,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 6,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'HORIZONTAL',
        x: 4,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 5,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        ship: {
          shipID: '',
          type: 'CARRIER',
          size: 5,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 4,
      },
      {
        ship: {
          shipID: '',
          type: 'BATTLESHIP',
          size: 4,
        },
        orientation: 'HORIZONTAL',
        x: 3,
        y: 5,
      },
      {
        ship: {
          shipID: '',
          type: 'CRUISER',
          size: 3,
        },
        orientation: 'VERTICAL',
        x: 7,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'HORIZONTAL',
        x: 4,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 5,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        ship: {
          shipID: '',
          type: 'CARRIER',
          size: 5,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 4,
      },
      {
        ship: {
          shipID: '',
          type: 'BATTLESHIP',
          size: 4,
        },
        orientation: 'HORIZONTAL',
        x: 3,
        y: 5,
      },
      {
        ship: {
          shipID: '',
          type: 'CRUISER',
          size: 3,
        },
        orientation: 'VERTICAL',
        x: 7,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 5,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'DESTROYER',
          size: 2,
        },
        orientation: 'HORIZONTAL',
        x: 4,
        y: 8,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'HORIZONTAL',
        x: 4,
        y: 3,
      },
      {
        ship: {
          shipID: '',
          type: 'SUBMARINE',
          size: 1,
        },
        orientation: 'HORIZONTAL',
        x: 2,
        y: 5,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        ship: {
          shipID: '',
          type: 'CARRIER',
          size: 5,
        },
        orientation: 'VERTICAL',
        x: 10,
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
        x: 8,
        y: 8,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
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
        y: -1,
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
        x: 8,
        y: 8,
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
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
        x: 3,
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
        x: 8,
        y: 8,
      },
    ],
  },
];
