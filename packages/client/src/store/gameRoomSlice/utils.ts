/* eslint-disable no-param-reassign */
import { PayloadAction } from "@reduxjs/toolkit";
import {
  GameSettings,
  ShipOrientation,
  PlacedShip,
  GameRoomStatus,
  Coordinate,
} from "@battleship/common/types/__generated__/types.generated.js";
import {
  GameStartedMessage,
  MoveResultMessageBase,
  OpponentMoveResultMessage,
  OwnMoveResultMessage,
  ServerMessage,
  ServerMessageCode,
} from "@battleship/common/messages/MessageTypes.js";
import { assertNever } from "@battleship/common/utils/typeUtils.js";
import {
  PlayerStatus,
  ScoreState,
  SliceState,
  SliceStateActive,
  GameRoomIsReady,
  GameResult,
  initialState,
  GameIsInProgress,
} from "./stateTypes.js";

const isEqual = (a: Coordinate, b: Coordinate) => a.x === b.x && a.y === b.y;

const isWithinShip = (
  { x, y }: Coordinate,
  { ship, position: { x: shipX, y: shipY }, orientation }: PlacedShip,
): boolean => {
  switch (orientation) {
    case ShipOrientation.Horizontal:
      return x >= shipX && x < shipX + ship.size && y === shipY;
    case ShipOrientation.Vertical:
      return y >= shipY && y < shipY + ship.size && x === shipX;
    default:
      return assertNever(orientation);
  }
};

const getShipSurroundingCells = (
  placedShip: PlacedShip,
  settings: GameSettings | null,
): Coordinate[] => {
  if (!settings) return [];

  const { ship, orientation, position: { x, y } } = placedShip;
  const xStart = Math.max(0, x - 1);
  const yStart = Math.max(0, y - 1);

  const xEnd =
    orientation === ShipOrientation.Horizontal
      ? Math.min(x + ship.size, settings.boardWidth - 1)
      : Math.min(x + 1, settings.boardWidth - 1);

  const yEnd =
    orientation === ShipOrientation.Vertical
      ? Math.min(y + ship.size, settings.boardHeight - 1)
      : Math.min(y + 1, settings.boardHeight - 1);

  const cells = [];
  for (let col = xStart; col <= xEnd; col += 1) {
    for (let row = yStart; row <= yEnd; row += 1) {
      const coord: Coordinate = { x: col, y: row };
      if (!isWithinShip(coord, placedShip)) cells.push(coord);
    }
  }

  return cells;
};

const applyMoveResult = (
  message: MoveResultMessageBase,
  state: SliceStateActive,
  score: ScoreState,
) => {
  const { position: { x, y }, hit, shipSunk, currentPlayerID } = message;

  state.currentPlayerID = currentPlayerID;

  if (shipSunk) {
    score.sunkenShips.push(shipSunk);

    score.hitCells = score.hitCells.filter(
      (coord) => !isWithinShip(coord, shipSunk),
    );

    let shipSurroundingCells = getShipSurroundingCells(
      shipSunk,
      state.gameSettings,
    );
    shipSurroundingCells = shipSurroundingCells.filter(
      (coord) =>
        !score.missedCells.some((existing) => isEqual(existing, coord)) &&
        !score.inaccessibleCells.some((existing) => isEqual(existing, coord)),
    );

    score.inaccessibleCells =
      score.inaccessibleCells.concat(shipSurroundingCells);
  } else if (hit) {
    score.hitCells.push({ x, y });
  } else {
    score.missedCells.push({ x, y });
  }
};

const applyOwnMoveResultMessage = (
  state: SliceStateActive,
  message: OwnMoveResultMessage,
) => {
  applyMoveResult(message, state, state.opponentScore);

  if (message.gameWon) {
    state.gameResult = GameResult.PlayerWon;
  }
};

const applyOpponentMoveResultMessage = (
  state: SliceStateActive,
  message: OpponentMoveResultMessage,
) => {
  applyMoveResult(message, state, state.playerScore);

  if (message.gameWon) {
    state.gameResult = GameResult.OpponentWon;
  }
};

const moveResultMessageReceived = (
  state: SliceState,
  message: OpponentMoveResultMessage | OwnMoveResultMessage,
) => {
  if (!GameRoomIsReady(state)) return;

  state.round += 1;

  const { code } = message;
  switch (code) {
    case ServerMessageCode.OpponentMoveResult:
      applyOpponentMoveResultMessage(state, message);
      break;
    case ServerMessageCode.OwnMoveResult:
      applyOwnMoveResultMessage(state, message);
      break;
    default:
      assertNever(code);
  }
};

export const processRoomStatus = (
  state: SliceState,
  roomStatus: GameRoomStatus,
) => {
  state.currentPlayerID = roomStatus.currentPlayerID ?? undefined;
  state.player = { ...roomStatus.player };
  if (roomStatus.opponent ) {
    state.opponent = { ...roomStatus.opponent };
  } else {
    state.opponent = undefined;
  }

  if (roomStatus.playerShipsPlaced && roomStatus.playerSocketConnected) {
    state.playerStatus = PlayerStatus.Ready;
  }

  if (roomStatus.opponent) {
    state.opponentStatus = PlayerStatus.Connected;
  }

  if (
    roomStatus.opponent &&
    roomStatus.opponentShipsPlaced &&
    roomStatus.opponentSocketConnected
  ) {
    state.opponentStatus = PlayerStatus.Ready;
  }
};

const processGameStartedMessage = (
  state: SliceState,
  message: GameStartedMessage,
) => {
  state.currentPlayerID = message.playsFirstID;
  state.gameStarted = true;
};

const processOpponentDisconnectedMessage = (state: SliceState) => {
  if (GameIsInProgress(state)) {
    state.gameResult = GameResult.OpponentDisconnected;
    state.opponentStatus = PlayerStatus.Disconnected;
  } else {
    Object.assign(state, { ...initialState });
  }
};

export const processMessageReceived = (
  state: SliceState,
  { payload }: PayloadAction<ServerMessage>,
) => {
  const { code } = payload;
  switch (code) {
    case ServerMessageCode.AuthenticatedResponse:
      break;
    case ServerMessageCode.RoomStatusResponse:
      processRoomStatus(state, payload.roomStatus);
      break;
    case ServerMessageCode.Error:
      break;
    case ServerMessageCode.GameStarted:
      processGameStartedMessage(state, payload);
      break;
    case ServerMessageCode.OpponentMoveResult:
      moveResultMessageReceived(state, payload);
      break;
    case ServerMessageCode.OwnMoveResult:
      moveResultMessageReceived(state, payload);
      break;
    case ServerMessageCode.OpponentDisconnected:
      processOpponentDisconnectedMessage(state);
      break;
    default:
      assertNever(code);
  }
};

export const processRematchAction = (state: SliceState) => {
  if (GameIsInProgress(state)) return;

  state.playerShips = undefined;
  state.gameStarted = false;
  state.round = 0;
  state.gameResult = null;

  state.playerScore = {
    hitCells: [],
    missedCells: [],
    inaccessibleCells: [],
    sunkenShips: [],
  };

  state.opponentScore = {
    hitCells: [],
    missedCells: [],
    inaccessibleCells: [],
    sunkenShips: [],
  };
};

export const canHitOpponentCell = (
  state: SliceState,
  cell: Coordinate,
): boolean => {
  if (!GameRoomIsReady(state)) return false;

  if (state.currentPlayerID !== state.player.id) return false;

  const { opponentScore } = state;

  if (opponentScore.hitCells.some((c) => isEqual(c, cell))) return false;

  if (opponentScore.missedCells.some((c) => isEqual(c, cell))) return false;

  if (opponentScore.sunkenShips.some((ship) => isWithinShip(cell, ship)))
    return false;

  if (opponentScore.inaccessibleCells.some((c) => isEqual(c, cell)))
    return false;

  return true;
};
