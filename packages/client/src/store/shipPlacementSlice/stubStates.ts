import { ShipOrientation, ShipClassName } from "@battleship/common/types/__generated__/types.generated.js";
import { SliceState } from "./types.js";

export const placedState: SliceState = {
  placedIDs: [
    "CARRIER-0",
    "BATTLESHIP-0",
    "CRUISER-0",
    "DESTROYER-0",
    "DESTROYER-1",
    "SUBMARINE-1",
    "SUBMARINE-0",
  ],
  nonPlacedIDs: [],
  shipStates: [
    {
      ship: {
        shipID: "CARRIER-0",
        size: 5,
        type: ShipClassName.Carrier,
      },
      orientation: ShipOrientation.Horizontal,
      position: {
        x: 0,
        y: 1,
      },
    },
    {
      ship: {
        shipID: "BATTLESHIP-0",
        size: 4,
        type: ShipClassName.Battleship,
      },
      orientation: ShipOrientation.Horizontal,
      position: {
        x: 6,
        y: 0,
      },
    },
    {
      ship: {
        shipID: "CRUISER-0",
        size: 3,
        type: ShipClassName.Cruiser,
      },
      orientation: ShipOrientation.Horizontal,
      position: {
        x: 0,
        y: 3,
      },
    },
    {
      ship: {
        shipID: "DESTROYER-0",
        size: 2,
        type: ShipClassName.Destroyer,
      },
      orientation: ShipOrientation.Horizontal,
      position: {
        x: 7,
        y: 2,
      },
    },
    {
      ship: {
        shipID: "DESTROYER-1",
        size: 2,
        type: ShipClassName.Destroyer,
      },
      orientation: ShipOrientation.Horizontal,
      position: {
        x: 4,
        y: 5,
      },
    },
    {
      ship: {
        shipID: "SUBMARINE-0",
        size: 1,
        type: ShipClassName.Submarine,
      },
      orientation: ShipOrientation.Horizontal,
      position: {
        x: 1,
        y: 7,
      },
    },
    {
      ship: {
        shipID: "SUBMARINE-1",
        size: 1,
        type: ShipClassName.Submarine,
      },
      orientation: ShipOrientation.Horizontal,
      position: {
        x: 8,
        y: 7,
      },
    },
  ],
  grid: {
    columns: 10,
    rows: 10,
    cellStates: [
      [
        null,
        null,
        null,
        null,
        null,
        null,
        "BATTLESHIP-0",
        "BATTLESHIP-0",
        "BATTLESHIP-0",
        "BATTLESHIP-0",
      ],
      [
        "CARRIER-0",
        "CARRIER-0",
        "CARRIER-0",
        "CARRIER-0",
        "CARRIER-0",
        null,
        null,
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "DESTROYER-0",
        "DESTROYER-0",
        null,
      ],
      [
        "CRUISER-0",
        "CRUISER-0",
        "CRUISER-0",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      [null, null, null, null, null, null, null, null, null, null],
      [
        null,
        null,
        null,
        null,
        "DESTROYER-1",
        "DESTROYER-1",
        null,
        null,
        null,
        null,
      ],
      [null, null, null, null, null, null, null, null, null, null],
      [
        null,
        "SUBMARINE-0",
        null,
        null,
        null,
        null,
        null,
        null,
        "SUBMARINE-1",
        null,
      ],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ],
  },
};

export const emptyState: SliceState = {
  placedIDs: [],
  nonPlacedIDs: [
    "CARRIER-0",
    "BATTLESHIP-0",
    "CRUISER-0",
    "DESTROYER-0",
    "DESTROYER-1",
    "SUBMARINE-0",
    "SUBMARINE-1",
  ],
  shipStates: [
    {
      ship: {
        shipID: "CARRIER-0",
        size: 5,
        type: ShipClassName.Carrier,
      },
      orientation: ShipOrientation.Horizontal,
      position: null,
    },
    {
      ship: {
        shipID: "BATTLESHIP-0",
        size: 4,
        type: ShipClassName.Battleship,
      },
      orientation: ShipOrientation.Horizontal,
      position: null,
    },
    {
      ship: {
        shipID: "CRUISER-0",
        size: 3,
        type: ShipClassName.Cruiser,
      },
      orientation: ShipOrientation.Horizontal,
      position: null,
    },
    {
      ship: {
        shipID: "DESTROYER-0",
        size: 2,
        type: ShipClassName.Destroyer,
      },
      orientation: ShipOrientation.Horizontal,
      position: null,
    },
    {
      ship: {
        shipID: "DESTROYER-0",
        size: 2,
        type: ShipClassName.Destroyer,
      },
      orientation: ShipOrientation.Horizontal,
      position: null,
    },
    {
      ship: {
        shipID: "SUBMARINE-0",
        size: 1,
        type: ShipClassName.Submarine,
      },
      orientation: ShipOrientation.Horizontal,
      position: null,
    },
    {
      ship: {
        shipID: "SUBMARINE-0",
        size: 1,
        type: ShipClassName.Submarine,
      },
      orientation: ShipOrientation.Horizontal,
      position: null,
    },
  ],
  grid: {
    columns: 10,
    rows: 10,
    cellStates: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ],
  },
};
