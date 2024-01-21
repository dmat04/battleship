/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import { ShipPlacement, GameSettings, GameRoomStatus } from '../../__generated__/graphql';
import { CellState, GameState, SliceState } from './stateTypes';
import {
  GameStartedMessage,
  OpponentMoveResultMessage,
  OwnMoveResultMessage,
  RoomStatusResponseMessage,
  ServerMessage,
  ServerMessageCode,
} from './messageTypes';
import { assertNever } from '../../utils/typeUtils';

export interface GameInitArgs {
  playerName: string;
  playerShips: ShipPlacement[];
  gameSettings: GameSettings;
  gameRoomStatus: GameRoomStatus;
}

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

const applyOwnMoveResultMessage = (state: SliceState, message: OwnMoveResultMessage) => {
  const {
    result,
    currentPlayer,
    x,
    y,
  } = message;
  const { hit, shipSunk } = result;

  state.currentPlayer = currentPlayer;
  state.opponentGrid[y][x] = hit ? CellState.Hit : CellState.Miss;

  if (shipSunk) {
    state.sunkenOpponentShips.push(shipSunk);
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
  state.playerGrid[y][x] = hit ? CellState.Hit : CellState.Miss;

  if (shipSunk) {
    state.sunkenPayerShips.push(shipSunk);
  }
};

const moveResultMessageReceived = (
  state: SliceState,
  message: OpponentMoveResultMessage | OwnMoveResultMessage,
) => {
  if (state.pendingMoveResult === null) {
    state.pendingMoveResult = message;
  } else {
    state.moveResultQueue.push(message);
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

  const playerGrid = [];
  const opponentGrid = [];

  const { boardHeight, boardWidth } = gameSettings;
  for (let row = 0; row < boardHeight; row += 1) {
    playerGrid.push((new Array(boardWidth)).fill(CellState.Empty));
    opponentGrid.push((new Array(boardWidth)).fill(CellState.Empty));
  }

  const newState: SliceState = {
    gameState: getInitialGameState(playerName, gameRoomStatus),
    username: playerName,
    currentPlayer: gameRoomStatus.currentPlayer ?? null,
    playerShips: [...playerShips],
    playerGrid,
    opponentGrid,
    sunkenPayerShips: [],
    sunkenOpponentShips: [],
    moveResultQueue: [],
    pendingMoveResult: null,
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

export const processAcknowledgeMoveResult = (state: SliceState) => {
  if (state.pendingMoveResult === null) return;

  const { code } = state.pendingMoveResult;
  switch (code) {
    case ServerMessageCode.OpponentMoveResult:
      applyOpponentMoveResultMessage(state, state.pendingMoveResult);
      break;
    case ServerMessageCode.OwnMoveResult:
      applyOwnMoveResultMessage(state, state.pendingMoveResult);
      break;
    default: assertNever(code);
  }

  const nextMoveResult = state.moveResultQueue.shift();
  state.pendingMoveResult = nextMoveResult ?? null;
};
