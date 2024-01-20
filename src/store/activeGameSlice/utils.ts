/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import { ShipPlacement, GameSettings, GameRoomStatus } from '../../__generated__/graphql';
import { CellState, SliceState } from './stateTypes';
import { ServerMessage, ServerMessageCode } from './messageTypes';
import { assertNever } from '../../utils/typeUtils';

export interface GameInitArgs {
  playerShips: ShipPlacement[];
  gameSettings: GameSettings;
  gameRoomStatus: GameRoomStatus;
}

export const processGameInitAction = (state: SliceState, action: PayloadAction<GameInitArgs>) => {
  const { playerShips, gameSettings, gameRoomStatus } = action.payload;

  const playerGrid = [];
  const opponentGrid = [];

  const { boardHeight, boardWidth } = gameSettings;
  for (let row = 0; row < boardHeight; row += 1) {
    playerGrid.push((new Array(boardWidth)).fill(CellState.Empty));
    opponentGrid.push((new Array(boardWidth)).fill(CellState.Empty));
  }

  state.gameRoomStatus = { ...gameRoomStatus };
  state.playerShips = [...playerShips];
  state.playerGrid = playerGrid;
  state.opponentGrid = opponentGrid;
  state.sunkenPayerShips = [];
  state.sunkenOpponentShips = [];
  state.messageQueue = [];
  state.pendingMessage = null;
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

  discardPendingMessage(state);

  const {
    result,
    currentPlayer,
    x,
    y,
  } = message;
  const { hit, shipSunk } = result;

  state.gameRoomStatus.currentPlayer = currentPlayer;
  state.playerGrid[y][x] = hit ? CellState.Hit : CellState.Miss;

  if (shipSunk) {
    state.sunkenPayerShips.push(shipSunk);
  }
};

const processOwnMoveResultMessage = (state: SliceState) => {
  const message = state.pendingMessage;
  if (!message || message.code !== ServerMessageCode.OwnMoveResult) return;

  discardPendingMessage(state);

  const {
    result,
    currentPlayer,
    x,
    y,
  } = message;
  const { hit, shipSunk } = result;

  state.gameRoomStatus.currentPlayer = currentPlayer;
  state.opponentGrid[y][x] = hit ? CellState.Hit : CellState.Miss;

  if (shipSunk) {
    state.sunkenOpponentShips.push(shipSunk);
  }
};

export const processAcknowledgePendingMessage = (state: SliceState) => {
  if (state.pendingMessage === null) return;

  const { code } = state.pendingMessage;
  switch (code) {
    case ServerMessageCode.AuthenticatedResponse:
    case ServerMessageCode.RoomStatusResponse:
    case ServerMessageCode.Error:
    case ServerMessageCode.GameStarted:
      discardPendingMessage(state);
      return;
    case ServerMessageCode.OpponentMoveResult:
      processOpponentMoveResultMessage(state);
      return;
    case ServerMessageCode.OwnMoveResult:
      processOwnMoveResultMessage(state);
      return;
    default: assertNever(code);
  }
};
