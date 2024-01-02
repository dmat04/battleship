import { PayloadAction } from '@reduxjs/toolkit';
import {
  PlaceShipArgs, GridState, ShipState, SliceState, ShipID, ShipStatePlaced, ShipStateNotPlaced,
} from './types';
import { ShipOrientation } from '../../__generated__/graphql';
import { assertNever } from '../../utils/typeUtils';

const canPlaceShip = (grid: GridState, ship: ShipState, x: number, y: number): boolean => {
  const { columns, rows, cellStates } = grid;
  const { shipID, shipClass, orientation } = ship;
  const { size } = shipClass;

  let vSize = 0;
  let hSize = 0;

  switch (orientation) {
    case ShipOrientation.Horizontal: vSize = 1; hSize = size; break;
    case ShipOrientation.Vertical: vSize = size; hSize = 1; break;
    default: assertNever(orientation);
  }

  if (x + hSize > columns
    || x < 0
    || y + vSize > rows
    || y < 0
  ) {
    return false;
  }

  const colStart = Math.max(0, x - 1);
  const colEnd = Math.min(columns - 1, x + hSize);
  const rowStart = Math.max(0, y - 1);
  const rowEnd = Math.min(rows - 1, y + vSize);

  for (let i = rowStart; i <= rowEnd; i += 1) {
    const row = cellStates[i];
    for (let j = colStart; j <= colEnd; j += 1) {
      if (row[j] !== null && row[j] !== shipID) return false;
    }
  }

  return true;
};

const shipIdentityPredicate = (wantedID: ShipID) => ({ shipID }: ShipState) => shipID === wantedID;

const transferShipToPlaced = (state: SliceState, id: ShipID, x: number, y: number) => {
  const predicate = shipIdentityPredicate(id);

  const allIndex = state.allShips.findIndex(predicate);
  if (allIndex < 0) return;

  const placedIndex = state.placedShips.findIndex(predicate);
  if (placedIndex >= 0) return;

  const nonPlacedIndex = state.nonPlacedShips.findIndex(predicate);
  if (nonPlacedIndex < 0) return;

  const oldState = state.allShips[allIndex];
  const placedState: ShipStatePlaced = {
    placed: true,
    orientation: oldState.orientation,
    shipClass: oldState.shipClass,
    shipID: oldState.shipID,
    x,
    y,
  };

  // eslint-disable-next-line no-param-reassign
  state.allShips[allIndex] = placedState;
  state.placedShips.push(placedState);
  // eslint-disable-next-line no-param-reassign
  state.nonPlacedShips = state.nonPlacedShips.filter(({ shipID }) => shipID !== id);
};

const transferShipToNonPlaced = (state: SliceState, id: ShipID) => {
  const predicate = shipIdentityPredicate(id);

  const allIndex = state.allShips.findIndex(predicate);
  if (allIndex < 0) return;

  const placedIndex = state.placedShips.findIndex(predicate);
  if (placedIndex < 0) return;

  const nonPlacedIndex = state.nonPlacedShips.findIndex(predicate);
  if (nonPlacedIndex <= 0) return;

  const oldState = state.allShips[allIndex];
  const nonPlacedState: ShipStateNotPlaced = {
    placed: false,
    orientation: oldState.orientation,
    shipClass: oldState.shipClass,
    shipID: oldState.shipID,
  };

  // eslint-disable-next-line no-param-reassign
  state.allShips[allIndex] = nonPlacedState;
  state.nonPlacedShips.push(nonPlacedState);
  // eslint-disable-next-line no-param-reassign
  state.placedShips = state.placedShips.filter(({ shipID }) => shipID !== id);
};

const clearShipFromGrid = (grid: GridState, ship: ShipID): void => {
  // eslint-disable-next-line arrow-body-style, no-param-reassign
  grid.cellStates = grid.cellStates.map((row) => {
    return row.map((cell) => (cell === ship ? null : cell));
  });
};

const placeShip = (state: SliceState, ship: ShipState, x: number, y: number) => {
  if (ship.placed) {
    clearShipFromGrid(state.grid, ship.shipID);
  }

  transferShipToPlaced(state, ship.shipID, x, y);

  const { shipID, shipClass, orientation } = ship;
  const { size } = shipClass;

  switch (orientation) {
    case ShipOrientation.Horizontal: {
      for (let column = x; column < size; column += 1) {
        // eslint-disable-next-line no-param-reassign
        state.grid.cellStates[y][column] = shipID;
      }
      break;
    }
    case ShipOrientation.Vertical: {
      for (let row = y; row < size; row += 1) {
        // eslint-disable-next-line no-param-reassign
        state.grid.cellStates[row][x] = shipID;
      }
      break;
    }
    default: assertNever(orientation);
  }
};

export const processPlaceShipAction = (
  state: SliceState,
  { payload }: PayloadAction<PlaceShipArgs>,
) => {
  const shipState = state.allShips.find((item) => item.shipID === payload.shipID);

  if (!shipState) return;
  if (!canPlaceShip(state.grid, shipState, payload.x, payload.y)) return;

  placeShip(state, shipState, payload.x, payload.y);
};

export const processResetShipAction = (
  state: SliceState,
  { payload }: PayloadAction<ShipID>,
) => {
  const ship = state.allShips.find((item) => item.shipID === payload);

  if (ship?.placed) {
    transferShipToNonPlaced(state, payload);
  }

  clearShipFromGrid(state.grid, payload);
};

export default {};
