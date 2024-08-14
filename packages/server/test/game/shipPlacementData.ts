import {
  ShipOrientation,
  ShipPlacementInput,
} from "@battleship/common/types/__generated__/types.generated.js";


interface PlacementTestData {
  populatedCells: number;
  placements: ShipPlacementInput[];
}

export const validPlacements: PlacementTestData[] = [
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 1
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 7,
          y: 4
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 7,
          y: 9
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 1,
          y: 1
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 4
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 3,
          y: 2
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 0,
          y: 9
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 9
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 8,
          y: 3
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 0,
          y: 0
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 0,
          y: 6
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 0,
          y: 9
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 9,
          y: 1
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 9,
          y: 9
        }
      },
    ],
  },
];

export const invalidPlacements: PlacementTestData[] = [
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 1
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 7,
          y: 4
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 7,
          y: 9
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 1,
          y: 1
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 4
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 3,
          y: 2
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 8,
          y: 8
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 5,
          y: 9
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 0,
          y: 9
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 0,
          y: 6
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 0,
          y: 0
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 0,
          y: 4
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 4,
          y: 9
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 0,
          y: 2
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 4,
          y: 0
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 6
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 3
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 1
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 0
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 1,
          y: 0
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 0
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 4
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 5
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 7,
          y: 3
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 3
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 5,
          y: 3
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 4,
          y: 3
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 5
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 1
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 7,
          y: 6
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 7,
          y: 9
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 1,
          y: 1
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 4
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 3,
          y: 2
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 8,
          y: 8
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 6,
          y: 9
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 0,
          y: 9
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 0,
          y: 6
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 0,
          y: 0
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 0,
          y: 4
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 4,
          y: 9
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 0,
          y: 2
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 4,
          y: 0
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 7
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 3
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 1
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 0
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 1,
          y: 0
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 0
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 4
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 5
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 7,
          y: 3
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 3
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 6,
          y: 3
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 4,
          y: 3
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 5
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 4
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 5
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 7,
          y: 3
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 3
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 4,
          y: 3
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 5
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 4
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 5
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 7,
          y: 3
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 3
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 5,
          y: 3
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 4,
          y: 8
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 4,
          y: 3
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 2,
          y: 5
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 10,
          y: 1
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 7,
          y: 4
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 7,
          y: 9
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 1,
          y: 1
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 4
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 3,
          y: 2
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 8,
          y: 8
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 1
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 7,
          y: 4
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 7,
          y: -1
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 1,
          y: 1
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 4
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 3,
          y: 2
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 8,
          y: 8
        }
      },
    ],
  },
  {
    populatedCells: 18,
    placements: [
      {
        shipID: "CARRIER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 9,
          y: 1
        }
      },
      {
        shipID: "BATTLESHIP-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 7,
          y: 4
        }
      },
      {
        shipID: "CRUISER-0",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 7,
          y: 9
        }
      },
      {
        shipID: "DESTROYER-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 3,
          y: 1
        }
      },
      {
        shipID: "DESTROYER-1",
        orientation: ShipOrientation.Horizontal,
        position: {
          x: 3,
          y: 4
        }
      },
      {
        shipID: "SUBMARINE-0",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 3,
          y: 2
        }
      },
      {
        shipID: "SUBMARINE-1",
        orientation: ShipOrientation.Vertical,
        position: {
          x: 8,
          y: 8
        }
      },
    ],
  },
];
