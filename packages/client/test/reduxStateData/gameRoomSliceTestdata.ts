import { GameSettings, PlacedShip, ShipClassName, ShipOrientation } from "@battleship/common/types/__generated__/types.generated.js";
import { PlayerStatus, ScoreState, SliceStateActive, SliceStateInactive } from "../../src/store/gameRoomSlice/stateTypes.js";
import { PLAYER_NAME } from "./authSliceTestdata.js";

export const OPPONENT_NAME = "OpponentName";
export const INVITE_CODE = "123456";
export const WS_AUTH_CODE = "WebsocketAuthToken";
export const ROOM_ID = "RoomID";

const emptyScore: ScoreState = {
  missedCells: [],
  hitCells: [],
  inaccessibleCells: [],
  sunkenShips: [],
};

const requestStatusIdle = {
  loadingNewRoom: false,
  loadingJoinRoom: false,
  loadingSettings: false,
};

export const gameSettings: GameSettings = {
  boardHeight: 10,
  boardWidth: 10,
  turnDuration: 20,
  availableShips: [
    {
      shipID: "CARRIER-0",
      size: 5,
      type: ShipClassName.Carrier,
    },
    {
      shipID: "BATTLESHIP-0",
      size: 4,
      type: ShipClassName.Battleship,
    },
    {
      shipID: "CRUISER-0",
      size: 3,
      type: ShipClassName.Cruiser,
    },
    {
      shipID: "DESTROYER-0",
      size: 2,
      type: ShipClassName.Destroyer,
    },
    {
      shipID: "DESTROYER-1",
      size: 2,
      type: ShipClassName.Destroyer,
    },
    {
      shipID: "SUBMARINE-0",
      size: 1,
      type: ShipClassName.Submarine,
    },
    {
      shipID: "SUBMARINE-1",
      size: 1,
      type: ShipClassName.Submarine,
    },
  ],
};

const playerShips: PlacedShip[] = [
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
];

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

export const gameRoomCreated: SliceStateInactive = {
  roomID: ROOM_ID,
  gameSettings: undefined,
  playerStatus: PlayerStatus.Disconnected,
  opponentStatus: PlayerStatus.Disconnected,
  playerName: undefined,
  opponentName: undefined,
  currentPlayer: undefined,
  playerShips: undefined,
  inviteCode: INVITE_CODE,
  gameStarted: false,
  round: 0,
  playerScore: { ...emptyScore },
  opponentScore: { ...emptyScore },
  gameResult: null,
  requestStatus: requestStatusIdle,
}

export const gameSettingsFetched: Partial<SliceStateActive> = {
  gameSettings
};

export const playerWSOpened: Partial<SliceStateActive> = {
  playerStatus: PlayerStatus.Connected,
};

export const initialRoomStatusReceived: Partial<SliceStateActive> = {
  playerName: PLAYER_NAME,
  currentPlayer: PLAYER_NAME,
};

export const playerShipsPlaced: Partial<SliceStateActive> = {
  playerShips,
  playerStatus: PlayerStatus.Ready,
};

export const opponentJoined: Partial<SliceStateActive> = {
  opponentName: OPPONENT_NAME,
};

export const opponentWSOpened: Partial<SliceStateActive> = {
  opponentStatus: PlayerStatus.Connected,
};

export const opponentReady: Partial<SliceStateActive> = {
  opponentStatus: PlayerStatus.Ready,
};

export const gameInProgressState: SliceStateActive = {
  roomID: ROOM_ID,
  inviteCode: INVITE_CODE,
  requestStatus: {
    loadingJoinRoom: false,
    loadingNewRoom: false,
    loadingSettings: false,
  },
  playerName: PLAYER_NAME,
  opponentName: OPPONENT_NAME,
  playerStatus: PlayerStatus.Ready,
  opponentStatus: PlayerStatus.Ready,
  gameStarted: true,
  round: 10,
  gameResult: null,
  gameSettings,
  currentPlayer: OPPONENT_NAME,
  playerShips,
  playerScore: stubScore,
  opponentScore: stubScore,
};
