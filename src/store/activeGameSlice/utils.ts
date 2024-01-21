/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import { ShipPlacement, GameSettings, GameRoomStatus } from '../../__generated__/graphql';
import { CellState, GameState, SliceState } from './stateTypes';
import { ServerMessage, ServerMessageCode } from './messageTypes';
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
    messageQueue: [],
    pendingMessage: null,
  };

  return newState;
};

export const processMessageReceived = (
  state: SliceState,
  { payload }: PayloadAction<ServerMessage>,
) => {
  if (state.pendingMessage === null) {
    state.pendingMessage = payload;
  } else {
    state.messageQueue.push(payload);
  }
};

const discardPendingMessage = (state: SliceState) => {
  const nextPending = state.messageQueue.shift();

  state.pendingMessage = nextPending ?? null;
};

const processOpponentMoveResultMessage = (state: SliceState) => {
  const message = state.pendingMessage;
  if (!message || message.code !== ServerMessageCode.OpponentMoveResult) return;

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

const processOwnMoveResultMessage = (state: SliceState) => {
  const message = state.pendingMessage;
  if (!message || message.code !== ServerMessageCode.OwnMoveResult) return;

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

const processRoomStatusResponseMessage = (state: SliceState) => {
  const message = state.pendingMessage;
  if (!message || message.code !== ServerMessageCode.RoomStatusResponse) return;

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

const processGameStartedMessage = (state: SliceState) => {
  const message = state.pendingMessage;
  if (!message || message.code !== ServerMessageCode.GameStarted) return;

  state.gameState = GameState.InProgress;
};

export const processAcknowledgePendingMessage = (state: SliceState) => {
  if (state.pendingMessage === null) return;

  const { code } = state.pendingMessage;
  switch (code) {
    case ServerMessageCode.AuthenticatedResponse:
      break;
    case ServerMessageCode.RoomStatusResponse:
      processRoomStatusResponseMessage(state);
      break;
    case ServerMessageCode.Error:
      break;
    case ServerMessageCode.GameStarted:
      processGameStartedMessage(state);
      break;
    case ServerMessageCode.OpponentMoveResult:
      processOpponentMoveResultMessage(state);
      break;
    case ServerMessageCode.OwnMoveResult:
      processOwnMoveResultMessage(state);
      break;
    default: assertNever(code);
  }

  discardPendingMessage(state);
};
