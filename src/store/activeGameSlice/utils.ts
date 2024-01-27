/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import { GameRoomStatus, GameSettings, ShipOrientation } from '../../__generated__/graphql';
import { GameInitArgs, GameState, SliceState } from './stateTypes';
import { Coordinates } from '../shipPlacementSlice/types';
import {
  ShipPlacement,
  GameStartedMessage,
  OpponentMoveResultMessage,
  OwnMoveResultMessage,
  RoomStatusResponseMessage,
  ServerMessage,
  ServerMessageCode,
} from './messageTypes';
import { assertNever } from '../../utils/typeUtils';

const getInitialGameState = (playerName: string, gameRoomStatus: GameRoomStatus): GameState => {
  const [playerWsOpen, opponentWsOpen] = playerName === gameRoomStatus.player1
    ? [gameRoomStatus.p1WSOpen, gameRoomStatus.p2WSOpen]
    : [gameRoomStatus.p2WSOpen, gameRoomStatus.p2WSOpen];

  const [playerPlaced, opponentPlaced] = playerName === gameRoomStatus.player1
    ? [gameRoomStatus.p1ShipsPlaced, gameRoomStatus.p2ShipsPlaced]
    : [gameRoomStatus.p2ShipsPlaced, gameRoomStatus.p1ShipsPlaced];

  const opponentName = playerName === gameRoomStatus.player1
    ? gameRoomStatus.player2
    : gameRoomStatus.player1;

  if (!playerWsOpen || !playerPlaced) {
    return GameState.PlayerNotReady;
  }

  if (opponentPlaced && opponentWsOpen) {
    return GameState.OpponentReady;
  }

  if (!opponentPlaced && !opponentWsOpen && !opponentName) {
    return GameState.WaitingForOpponentToConnect;
  }

  return GameState.WaitingForOpponentToGetReady;
};

const isWithinShip = (
  { x, y }: Coordinates,
  ship: ShipPlacement,
): boolean => {
  switch (ship.orientation) {
    case ShipOrientation.Horizontal:
      return x >= ship.x && x < ship.x + ship.shipClass.size && y === ship.y;
    case ShipOrientation.Vertical:
      return y >= ship.y && y < ship.y + ship.shipClass.size && x === ship.x;
    default: return assertNever(ship.orientation);
  }
};

const isWithinShipSurroundings = (
  { x, y }: Coordinates,
  ship: ShipPlacement,
  settings: GameSettings | null,
): boolean => {
  if (!settings) return false;

  const xStart = Math.max(0, ship.x - 1);
  const yStart = Math.max(0, ship.y - 1);

  const xEnd = ship.orientation === ShipOrientation.Horizontal
    ? Math.min(ship.x + ship.shipClass.size, settings.boardWidth - 1)
    : Math.min(ship.x + 1, settings.boardWidth - 1);

  const yEnd = ship.orientation === ShipOrientation.Vertical
    ? Math.min(ship.y + ship.shipClass.size, settings.boardHeight - 1)
    : Math.min(ship.y + 1, settings.boardHeight - 1);

  return (
    x >= xStart
    && x <= xEnd
    && y >= yStart
    && y <= yEnd
  );
};

const getShipSurroundingCells = (
  ship: ShipPlacement,
  settings: GameSettings | null,
): Coordinates[] => {
  if (!settings) return [];

  const xStart = Math.max(0, ship.x - 1);
  const yStart = Math.max(0, ship.y - 1);

  const xEnd = ship.orientation === ShipOrientation.Horizontal
    ? Math.min(ship.x + ship.shipClass.size, settings.boardWidth - 1)
    : Math.min(ship.x + 1, settings.boardWidth - 1);

  const yEnd = ship.orientation === ShipOrientation.Vertical
    ? Math.min(ship.y + ship.shipClass.size, settings.boardHeight - 1)
    : Math.min(ship.y + 1, settings.boardHeight - 1);

  const cells = [];
  for (let x = xStart; x <= xEnd; x += 1) {
    for (let y = yStart; y <= yEnd; y += 1) {
      const coord = { x, y };
      if (!isWithinShip(coord, ship)) cells.push(coord);
    }
  }

  return cells;
};

const applyOwnMoveResultMessage = (state: SliceState, message: OwnMoveResultMessage) => {
  const {
    result,
    currentPlayer,
    x,
    y,
  } = message;
  const { hit, shipSunk } = result;

  state.currentPlayer = currentPlayer;
  if (shipSunk) {
    state.opponentGridState.sunkenShips.push(shipSunk);

    state.opponentGridState.hitCells = state
      .opponentGridState
      .hitCells
      .filter((coord) => !isWithinShip(coord, shipSunk));

    state.opponentGridState.missedCells = state
      .opponentGridState
      .missedCells
      .filter((coord) => !isWithinShipSurroundings(coord, shipSunk, state.gameSettings));

    let shipSurroundingCells = getShipSurroundingCells(shipSunk, state.gameSettings);
    shipSurroundingCells = shipSurroundingCells
      .filter((coord) => !state
        .opponentGridState
        .sunkenShipSurroundings
        .some((existing) => existing.x === coord.x && existing.y === coord.y));

    state.opponentGridState.sunkenShipSurroundings = state
      .opponentGridState
      .sunkenShipSurroundings
      .concat(shipSurroundingCells);
  } else if (hit) {
    state.opponentGridState.hitCells.push({ x, y });
  } else {
    state.opponentGridState.missedCells.push({ x, y });
  }
};

const applyOpponentMoveResultMessage = (
  state: SliceState,
  message: OpponentMoveResultMessage,
) => {
  const {
    result,
    currentPlayer,
    x,
    y,
  } = message;
  const { hit, shipSunk } = result;

  state.currentPlayer = currentPlayer;
  if (shipSunk) {
    state.playerGridState.sunkenShips.push(shipSunk);

    state.playerGridState.hitCells = state
      .playerGridState
      .hitCells
      .filter((coord) => !isWithinShip(coord, shipSunk));

    state.playerGridState.missedCells = state
      .playerGridState
      .missedCells
      .filter((coord) => !isWithinShipSurroundings(coord, shipSunk, state.gameSettings));

    let shipSurroundingCells = getShipSurroundingCells(shipSunk, state.gameSettings);
    shipSurroundingCells = shipSurroundingCells
      .filter((coord) => !state
        .playerGridState
        .sunkenShipSurroundings
        .some((existing) => existing.x === coord.x && existing.y === coord.y));

    state.playerGridState.sunkenShipSurroundings = state
      .playerGridState
      .sunkenShipSurroundings
      .concat(shipSurroundingCells);
  } else if (hit) {
    state.playerGridState.hitCells.push({ x, y });
  } else {
    state.playerGridState.missedCells.push({ x, y });
  }
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
  const newState = getInitialGameState(state.username, message.roomStatus);
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

  const playerShipsMapped: ShipPlacement[] = playerShips.map((ship) => ({
    orientation: ship.orientation,
    shipClass: ship.shipClass,
    x: ship.position?.x ?? 0,
    y: ship.position?.y ?? 0,
  }));

  const newState: SliceState = {
    gameState: getInitialGameState(playerName, gameRoomStatus),
    username: playerName,
    gameSettings: { ...gameSettings },
    currentPlayer: gameRoomStatus.currentPlayer ?? null,
    playerShips: playerShipsMapped,
    playerGridState: {
      hitCells: [],
      missedCells: [],
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

  if (opponentGridState.sunkenShipSurroundings.some(
    (c) => c.x === cell.x && c.y === cell.y,
  )) return false;

  return true;
};
