import { ShipClassName, ShipOrientation } from '../../__generated__/graphql';
import { GameResult, PlayerStatus, SliceStateActive } from './stateTypes';

const stubScore = {
  hitCells: [
    { x: 7, y: 0 },
    { x: 8, y: 0 },
    { x: 2, y: 1 },
    { x: 4, y: 5 },
  ],
  missedCells: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 5, y: 1 },
    { x: 7, y: 4 },
    { x: 7, y: 5 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ],
  sunkenShips: [
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
  inaccessibleCells: [
    { x: 0, y: 2 },
    { x: 0, y: 4 },
    { x: 0, y: 6 },
    { x: 0, y: 7 },
    { x: 0, y: 8 },
    { x: 1, y: 2 },
    { x: 1, y: 4 },
    { x: 1, y: 6 },
    { x: 1, y: 8 },
    { x: 2, y: 2 },
    { x: 2, y: 4 },
    { x: 2, y: 6 },
    { x: 2, y: 7 },
    { x: 2, y: 8 },
    { x: 3, y: 2 },
    { x: 3, y: 3 },
    { x: 3, y: 4 },
    { x: 6, y: 2 },
    { x: 9, y: 2 },
    { x: 6, y: 1 },
    { x: 7, y: 1 },
    { x: 8, y: 1 },
    { x: 9, y: 1 },
    { x: 6, y: 3 },
    { x: 7, y: 3 },
    { x: 8, y: 3 },
    { x: 9, y: 3 },
  ],
};

const stateStub: SliceStateActive = {
  roomID: 'asdf',
  inviteCode: '',
  requestStatus: {
    loadingJoinRoom: false,
    loadingNewRoom: false,
    loadingSettings: false,
  },
  playerName: 'PlayerName',
  opponentName: 'OpponentName',
  playerStatus: PlayerStatus.Ready,
  opponentStatus: PlayerStatus.Ready,
  gameStarted: true,
  round: 10,
  gameResult: null,
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
  currentPlayer: 'OpponentName',
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
  playerScore: stubScore,
  opponentScore: stubScore,
};

export default stateStub;
