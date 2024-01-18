/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import { ShipPlacement, GameSettings, GameRoomStatus } from '../../__generated__/graphql';
import { CellState, SliceState } from './stateTypes';

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
};
