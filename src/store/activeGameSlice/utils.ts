/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import {
  GameRoomStatus,
  GameSettings,
  ShipOrientation,
  PlacedShip,
} from '../../__generated__/graphql';
import {
  GameInitArgs,
  GameState,
  GridState,
  SliceState,
} from './stateTypes';
import { Coordinates } from '../shipPlacementSlice/types';
import {
  GameStartedMessage,
  OpponentMoveResultMessage,
  OwnMoveResultMessage,
  RoomStatusResponseMessage,
  ServerMessage,
  ServerMessageCode,
  MoveResultMessage,
} from '../wsMiddleware/messageTypes';
import { assertNever } from '../../utils/typeUtils';

const getInitialGameState = (gameRoomStatus: GameRoomStatus): GameState => {
  const {
    playerSocketConnected,
    playerShipsPlaced,
    opponent,
    opponentSocketConnected,
    opponentShipsPlaced,
  } = gameRoomStatus;

  if (!playerSocketConnected || !playerShipsPlaced) {
    return GameState.PlayerNotReady;
  }

  if (opponentShipsPlaced && opponentSocketConnected) {
    return GameState.OpponentReady;
  }

  if (!opponentShipsPlaced && !opponentSocketConnected && !opponent) {
    return GameState.WaitingForOpponentToConnect;
  }

  return GameState.WaitingForOpponentToGetReady;
};

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

const applyMoveResult = (message: MoveResultMessage, state: SliceState, grid: GridState) => {
  const {
    result,
    currentPlayer,
    x,
    y,
  } = message;
  const { hit, shipSunk } = result;

  state.currentPlayer = currentPlayer;

  if (shipSunk) {
    grid.sunkenShips.push(shipSunk);

    grid.hitCells = grid.hitCells
      .filter((coord) => !isWithinShip(coord, shipSunk));

    let shipSurroundingCells = getShipSurroundingCells(shipSunk, state.gameSettings);
    shipSurroundingCells = shipSurroundingCells
      .filter((coord) => !grid.missedCells
        .some((existing) => existing.x === coord.x && existing.y === coord.y));

    grid.inaccessibleCells = grid.inaccessibleCells
      .concat(shipSurroundingCells);
  } else if (hit) {
    grid.hitCells.push({ x, y });
  } else {
    grid.missedCells.push({ x, y });
  }
};

const applyOwnMoveResultMessage = (state: SliceState, message: OwnMoveResultMessage) => {
  applyMoveResult(message, state, state.opponentGridState);
};

const applyOpponentMoveResultMessage = (
  state: SliceState,
  message: OpponentMoveResultMessage,
) => {
  applyMoveResult(message, state, state.playerGridState);
};

const moveResultMessageReceived = (
  state: SliceState,
  message: OpponentMoveResultMessage | OwnMoveResultMessage,
) => {
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

const processRoomStatusResponseMessage = (
  state: SliceState,
  message: RoomStatusResponseMessage,
) => {
  const newState = getInitialGameState(message.roomStatus);
  const { gameState } = state;

  if (
    gameState === GameState.PlayerNotReady
    || gameState === GameState.WaitingForOpponentToConnect
    || gameState === GameState.WaitingForOpponentToGetReady
  ) {
    state.gameState = newState;
  }
};

const processGameStartedMessage = (state: SliceState, message: GameStartedMessage) => {
  state.gameState = GameState.InProgress;
  state.currentPlayer = message.playsFirst;
};

export const processGameInitAction = (state: SliceState, action: PayloadAction<GameInitArgs>) => {
  const {
    playerName,
    playerShips,
    gameSettings,
    gameRoomStatus,
  } = action.payload;

  const newState: SliceState = {
    gameState: getInitialGameState(gameRoomStatus),
    username: playerName,
    gameSettings: { ...gameSettings },
    currentPlayer: gameRoomStatus.currentPlayer ?? null,
    playerShips: [...playerShips],
    playerGridState: {
      hitCells: [],
      missedCells: [],
      sunkenShips: [],
      inaccessibleCells: [],
    },
    opponentGridState: {
      hitCells: [],
      missedCells: [],
      sunkenShips: [],
      inaccessibleCells: [],
    },
    moveResultQueue: [],
  };

  return newState;
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
      processRoomStatusResponseMessage(state, payload);
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
  if (state.gameState !== GameState.InProgress) return false;

  if (state.currentPlayer !== state.username) return false;

  const { opponentGridState } = state;

  if (opponentGridState.hitCells.some(
    (c) => c.x === cell.x && c.y === cell.y,
  )) return false;

  if (opponentGridState.missedCells.some(
    (c) => c.x === cell.x && c.y === cell.y,
  )) return false;

  if (opponentGridState.sunkenShips.some(
    (ship) => isWithinShip(cell, ship),
  )) return false;

  if (opponentGridState.inaccessibleCells.some(
    (c) => c.x === cell.x && c.y === cell.y,
  )) return false;

  return true;
};
