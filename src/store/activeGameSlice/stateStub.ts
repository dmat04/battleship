const stateStub = {
  gameState: 'WaitingForOpponentToConnect',
  username: 'Guest#17315',
  gameSettings: {
    __typename: 'GameSettings',
    boardHeight: 10,
    boardWidth: 10,
    shipClasses: [
      {
        __typename: 'ShipClass',
        size: 1,
        type: 'SUBMARINE',
      },
      {
        __typename: 'ShipClass',
        size: 2,
        type: 'DESTROYER',
      },
      {
        __typename: 'ShipClass',
        size: 3,
        type: 'CRUISER',
      },
      {
        __typename: 'ShipClass',
        size: 4,
        type: 'BATTLESHIP',
      },
      {
        __typename: 'ShipClass',
        size: 5,
        type: 'CARRIER',
      },
    ],
    shipCounts: [
      {
        __typename: 'ShipCount',
        class: 'SUBMARINE',
        count: 2,
      },
      {
        __typename: 'ShipCount',
        class: 'DESTROYER',
        count: 2,
      },
      {
        __typename: 'ShipCount',
        class: 'CRUISER',
        count: 1,
      },
      {
        __typename: 'ShipCount',
        class: 'BATTLESHIP',
        count: 1,
      },
      {
        __typename: 'ShipCount',
        class: 'CARRIER',
        count: 1,
      },
    ],
  },
  currentPlayer: 'Guest#17315',
  playerShips: [
    {
      orientation: 'VERTICAL',
      shipClass: {
        __typename: 'ShipClass',
        size: 5,
        type: 'CARRIER',
      },
      x: 0,
      y: 0,
    },
    {
      orientation: 'VERTICAL',
      shipClass: {
        __typename: 'ShipClass',
        size: 4,
        type: 'BATTLESHIP',
      },
      x: 9,
      y: 3,
    },
    {
      orientation: 'HORIZONTAL',
      shipClass: {
        __typename: 'ShipClass',
        size: 3,
        type: 'CRUISER',
      },
      x: 4,
      y: 1,
    },
    {
      orientation: 'HORIZONTAL',
      shipClass: {
        __typename: 'ShipClass',
        size: 2,
        type: 'DESTROYER',
      },
      x: 0,
      y: 7,
    },
    {
      orientation: 'HORIZONTAL',
      shipClass: {
        __typename: 'ShipClass',
        size: 2,
        type: 'DESTROYER',
      },
      x: 5,
      y: 5,
    },
    {
      orientation: 'HORIZONTAL',
      shipClass: {
        __typename: 'ShipClass',
        size: 1,
        type: 'SUBMARINE',
      },
      x: 9,
      y: 0,
    },
    {
      orientation: 'HORIZONTAL',
      shipClass: {
        __typename: 'ShipClass',
        size: 1,
        type: 'SUBMARINE',
      },
      x: 6,
      y: 9,
    },
  ],
  playerGridState: {
    hitCells: [
      // { x: 0, y: 1 },
      // { x: 1, y: 7 },
      // { x: 9, y: 6 },
      // { x: 5, y: 1 },
    ],
    missedCells: [
      // { x: 2, y: 0 },
      // { x: 9, y: 2 },
      // { x: 5, y: 7 },
      // { x: 0, y: 9 },
    ],
    sunkenShips: [],
    sunkenShipSurroundings: [],
  },
  opponentGridState: {
    hitCells: [],
    missedCells: [],
    sunkenShips: [],
    sunkenShipSurroundings: [],
  },
  moveResultQueue: [],
};

export default stateStub;
