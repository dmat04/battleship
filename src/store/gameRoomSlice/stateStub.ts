import { ShipClassName, ShipOrientation } from '../../__generated__/graphql';
import { PlayerStatus, SliceStateActive } from './stateTypes';

const stateStub: SliceStateActive = {
  roomID: '',
  inviteCode: '',
  requestStatus: {
    loadingJoinRoom: false,
    loadingNewRoom: false,
    loadingSettings: false,
  },
  playerName: 'PlayerName',
  opponentName: 'OpponentName',
  playerStatus: PlayerStatus.Connected,
  opponentStatus: PlayerStatus.Disconnected,
  gameStarted: true,
  round: 10,
  gameSettings: {
    boardHeight: 10,
    boardWidth: 10,
    turnDuration: 20,
    availableShips: [
      {
        shipID: 'CARRIER-0',
        size: 5,
        type: ShipClassName.Carrier,
      },
      {
        shipID: 'BATTLESHIP-0',
        size: 4,
        type: ShipClassName.Battleship,
      },
      {
        shipID: 'CRUISER-0',
        size: 3,
        type: ShipClassName.Cruiser,
      },
      {
        shipID: 'DESTROYER-0',
        size: 2,
        type: ShipClassName.Destroyer,
      },
      {
        shipID: 'DESTROYER-1',
        size: 2,
        type: ShipClassName.Destroyer,
      },
      {
        shipID: 'SUBMARINE-0',
        size: 1,
        type: ShipClassName.Submarine,
      },
      {
        shipID: 'SUBMARINE-1',
        size: 1,
        type: ShipClassName.Submarine,
      },
    ],
  },
  currentPlayer: 'PlayerName',
  playerShips: [
    {
      ship: {
        shipID: 'CARRIER-0',
        size: 5,
        type: ShipClassName.Carrier,
      },
      orientation: ShipOrientation.Horizontal,
      x: 0,
      y: 1,
    },
    {
      ship: {
        shipID: 'BATTLESHIP-0',
        size: 4,
        type: ShipClassName.Battleship,
      },
      orientation: ShipOrientation.Horizontal,
      x: 6,
      y: 0,
    },
    {
      ship: {
        shipID: 'CRUISER-0',
        size: 3,
        type: ShipClassName.Cruiser,
      },
      orientation: ShipOrientation.Horizontal,
      x: 0,
      y: 3,
    },
    {
      ship: {
        shipID: 'DESTROYER-0',
        size: 2,
        type: ShipClassName.Destroyer,
      },
      orientation: ShipOrientation.Horizontal,
      x: 7,
      y: 2,
    },
    {
      ship: {
        shipID: 'DESTROYER-1',
        size: 2,
        type: ShipClassName.Destroyer,
      },
      orientation: ShipOrientation.Horizontal,
      x: 4,
      y: 5,
    },
    {
      ship: {
        shipID: 'SUBMARINE-0',
        size: 1,
        type: ShipClassName.Submarine,
      },
      orientation: ShipOrientation.Horizontal,
      x: 1,
      y: 7,
    },
    {
      ship: {
        shipID: 'SUBMARINE-1',
        size: 1,
        type: ShipClassName.Submarine,
      },
      orientation: ShipOrientation.Horizontal,
      x: 8,
      y: 7,
    },
  ],
  playerScore: {
    hitCells: [
      { x: 0, y: 1 },
      { x: 1, y: 7 },
      { x: 9, y: 6 },
      { x: 5, y: 1 },
    ],
    missedCells: [
      { x: 2, y: 0 },
      { x: 9, y: 2 },
      { x: 5, y: 7 },
      { x: 0, y: 9 },
    ],
    sunkenShips: [
      {
        ship: {
          shipID: 'CARRIER-0',
          size: 5,
          type: ShipClassName.Carrier,
        },
        orientation: ShipOrientation.Horizontal,
        x: 0,
        y: 1,
      },
      {
        ship: {
          shipID: 'CRUISER-0',
          size: 3,
          type: ShipClassName.Cruiser,
        },
        orientation: ShipOrientation.Horizontal,
        x: 0,
        y: 3,
      },
      {
        ship: {
          shipID: 'DESTROYER-0',
          size: 2,
          type: ShipClassName.Destroyer,
        },
        orientation: ShipOrientation.Horizontal,
        x: 7,
        y: 2,
      },
      {
        ship: {
          shipID: 'SUBMARINE-0',
          size: 1,
          type: ShipClassName.Submarine,
        },
        orientation: ShipOrientation.Horizontal,
        x: 1,
        y: 7,
      },
    ],
    inaccessibleCells: [],
  },
  opponentScore: {
    hitCells: [],
    missedCells: [],
    sunkenShips: [],
    inaccessibleCells: [],
  },
};

export default stateStub;
