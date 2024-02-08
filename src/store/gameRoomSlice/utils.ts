/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import {
  GameSettings,
  ShipOrientation,
  PlacedShip,
  GameRoomStatus,
} from '../../__generated__/graphql';
import { Coordinates } from '../shipPlacementSlice/types';
import {
  GameStartedMessage,
  MoveResultMessageBase,
  OpponentMoveResultMessage,
  OwnMoveResultMessage,
  ServerMessage,
  ServerMessageCode,
} from '../wsMiddleware/messageTypes';
import { assertNever } from '../../utils/typeUtils';
import {
  PlayerStatus,
  ScoreState,
  SliceState,
  SliceStateActive,
  GameRoomIsReady,
} from './stateTypes';

const isWithinShip = (
  { x, y }: Coordinates,
  {
    ship, x: shipX, y: shipY, orientation,
  }: PlacedShip,
): boolean => {
  switch (orientation) {
    case ShipOrientation.Horizontal:
      return x >= shipX && x < shipX + ship.size && y === shipY;
    case ShipOrientation.Vertical:
      return y >= shipY && y < shipY + ship.size && x === shipX;
    default: return assertNever(orientation);
  }
};

const getShipSurroundingCells = (
  placedShip: PlacedShip,
  settings: GameSettings | null,
): Coordinates[] => {
  if (!settings) return [];

  const {
    ship, orientation, x, y,
  } = placedShip;
  const xStart = Math.max(0, x - 1);
  const yStart = Math.max(0, y - 1);

  const xEnd = orientation === ShipOrientation.Horizontal
    ? Math.min(x + ship.size, settings.boardWidth - 1)
    : Math.min(x + 1, settings.boardWidth - 1);

  const yEnd = orientation === ShipOrientation.Vertical
    ? Math.min(y + ship.size, settings.boardHeight - 1)
    : Math.min(y + 1, settings.boardHeight - 1);

  const cells = [];
  for (let col = xStart; col <= xEnd; col += 1) {
    for (let row = yStart; row <= yEnd; row += 1) {
      const coord: Coordinates = { x: col, y: row };
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
  const {
    x,
    y,
    hit,
    shipSunk,
    currentPlayer,
  } = message;

  state.currentPlayer = currentPlayer;

  if (shipSunk) {
    score.sunkenShips.push(shipSunk);

    score.hitCells = score.hitCells
      .filter((coord) => !isWithinShip(coord, shipSunk));

    let shipSurroundingCells = getShipSurroundingCells(shipSunk, state.gameSettings);
    shipSurroundingCells = shipSurroundingCells
      .filter((coord) => !score.missedCells
        .some((existing) => existing.x === coord.x && existing.y === coord.y));

    score.inaccessibleCells = score.inaccessibleCells
      .concat(shipSurroundingCells);
  } else if (hit) {
    score.hitCells.push({ x, y });
  } else {
    score.missedCells.push({ x, y });
  }
};

const applyOwnMoveResultMessage = (state: SliceStateActive, message: OwnMoveResultMessage) => {
  applyMoveResult(message, state, state.opponentScore);
};

const applyOpponentMoveResultMessage = (
  state: SliceStateActive,
  message: OpponentMoveResultMessage,
) => {
  applyMoveResult(message, state, state.playerScore);
};

const moveResultMessageReceived = (
  state: SliceState,
  message: OpponentMoveResultMessage | OwnMoveResultMessage,
) => {
  if (!GameRoomIsReady(state)) return;

  const { code } = message;
  switch (code) {
    case ServerMessageCode.OpponentMoveResult:
      applyOpponentMoveResultMessage(state, message);
      break;
    case ServerMessageCode.OwnMoveResult:
      applyOwnMoveResultMessage(state, message);
      break;
    default: assertNever(code);
  }
};

export const processRoomStatus = (
  state: SliceState,
  roomStatus: GameRoomStatus,
) => {
  state.playerName = roomStatus.player;
  state.opponentName = roomStatus.opponent ?? undefined;
  state.currentPlayer = roomStatus.currentPlayer ?? undefined;

  if (roomStatus.playerShipsPlaced && roomStatus.playerSocketConnected) {
    state.playerStatus = PlayerStatus.Ready;
  }

  if (roomStatus.opponent) {
    state.opponentStatus = PlayerStatus.Connected;
  }

  if (roomStatus.opponent
    && roomStatus.opponentShipsPlaced
    && roomStatus.opponentSocketConnected
  ) {
    state.opponentStatus = PlayerStatus.Ready;
  }
};

const processGameStartedMessage = (state: SliceState, message: GameStartedMessage) => {
  state.currentPlayer = message.playsFirst;
  state.gameStarted = true;
};

export const processMessageReceived = (
  state: SliceState,
  { payload }: PayloadAction<ServerMessage>,
) => {
  const { code } = payload;
  console.log(JSON.stringify(payload, null, 2));

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
    default: assertNever(code);
  }
};

export const canHitOpponentCell = (state: SliceState, cell: Coordinates): boolean => {
  if (!GameRoomIsReady(state)) return false;

  if (state.currentPlayer !== state.playerName) return false;

  const { opponentScore } = state;

  if (opponentScore.hitCells.some(
    (c) => c.x === cell.x && c.y === cell.y,
  )) return false;

  if (opponentScore.missedCells.some(
    (c) => c.x === cell.x && c.y === cell.y,
  )) return false;

  if (opponentScore.sunkenShips.some(
    (ship) => isWithinShip(cell, ship),
  )) return false;

  if (opponentScore.inaccessibleCells.some(
    (c) => c.x === cell.x && c.y === cell.y,
  )) return false;

  return true;
};
