import { PayloadAction } from '@reduxjs/toolkit';
import {
  PlaceShipArgs, GridState, ShipState, SliceState, ShipID, Coordinates,
} from './types';
import { ShipOrientation } from '../../__generated__/graphql';
import { assertNever } from '../../utils/typeUtils';

const minmax = (min: number, value: number, max: number): number =>
  // eslint-disable-next-line implicit-arrow-linebreak
  Math.max(min, Math.min(max, value));

const canPlaceShip = (
  grid: GridState,
  ship: ShipState,
  { x, y }: Coordinates,
  orientation: ShipOrientation = ship.orientation,
): boolean => {
  const { columns, rows, cellStates } = grid;
  const { shipID, shipClass } = ship;
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

const fillGrid = (
  { cellStates }: GridState,
  { x, y }: Coordinates,
  orientation: ShipOrientation,
  size: number,
  value: ShipID | null,
) => {
  switch (orientation) {
    case ShipOrientation.Horizontal: {
      const row = cellStates[y];
      for (let col = 0; col < size; col += 1) {
        row[x + col] = value;
      }
      break;
    }
    case ShipOrientation.Vertical: {
      for (let row = 0; row < size; row += 1) {
        // eslint-disable-next-line no-param-reassign
        cellStates[y + row][x] = value;
      }
      break;
    }
    default: assertNever(orientation);
  }
};

const clearShipFromGrid = (grid: GridState, ship: ShipState): void => {
  if (!ship.position) return;

  fillGrid(grid, ship.position, ship.orientation, ship.shipClass.size, null);
};

const populateGridWithShip = (grid: GridState, ship: ShipState): void => {
  if (!ship.position) return;

  fillGrid(grid, ship.position, ship.orientation, ship.shipClass.size, ship.shipID);
};

const placeShip = (
  state: SliceState,
  shipIndex: number,
  { x, y }: Coordinates,
  orientation: ShipOrientation | null = null,
) => {
  const oldState = state.shipStates[shipIndex];
  if (oldState.position) {
    clearShipFromGrid(state.grid, oldState);
  }

  const newState: ShipState = {
    ...oldState,
    position: { x, y },
    orientation: orientation ?? oldState.orientation,
  };

  // eslint-disable-next-line no-param-reassign
  state.shipStates[shipIndex] = newState;
  populateGridWithShip(state.grid, newState);
};

const displaceShip = (state: SliceState, shipIndex: number) => {
  const oldState = state.shipStates[shipIndex];

  const newState: ShipState = {
    ...oldState,
    position: null,
  };

  // eslint-disable-next-line no-param-reassign
  state.shipStates[shipIndex] = newState;
  clearShipFromGrid(state.grid, oldState);
};

export const processPlaceShipAction = (
  state: SliceState,
  { payload }: PayloadAction<PlaceShipArgs>,
) => {
  const shipIndex = state.shipStates.findIndex(({ shipID }) => shipID === payload.shipID);
  if (shipIndex < 0) return;

  const shipState = state.shipStates[shipIndex];
  if (!canPlaceShip(state.grid, shipState, payload.position)) return;

  placeShip(state, shipIndex, payload.position);
};

export const processResetShipAction = (
  state: SliceState,
  { payload }: PayloadAction<ShipID>,
) => {
  const shipIndex = state.shipStates.findIndex(({ shipID }) => shipID === payload);
  if (shipIndex < 0) return;

  displaceShip(state, shipIndex);
};

export const processRotateShipAction = (
  state: SliceState,
  { payload }: PayloadAction<ShipID>,
) => {
  const shipIndex = state.shipStates.findIndex(({ shipID }) => shipID === payload);
  if (shipIndex < 0) return;

  const oldState = state.shipStates[shipIndex];
  const { shipClass, orientation, position } = oldState;

  let newOrientation = orientation;
  switch (orientation) {
    case ShipOrientation.Horizontal: newOrientation = ShipOrientation.Vertical; break;
    case ShipOrientation.Vertical: newOrientation = ShipOrientation.Horizontal; break;
    default: assertNever(orientation);
  }

  const newState: ShipState = {
    shipID: payload,
    shipClass,
    orientation: newOrientation,
    position: null,
  };

  if (position) {
    const { rows, columns } = state.grid;
    const halfSize = Math.floor(shipClass.size / 2);
    const rotatedPosition = { ...position };

    switch (orientation) {
      case ShipOrientation.Horizontal: {
        rotatedPosition.x = minmax(0, rotatedPosition.x + halfSize, columns - 1);
        rotatedPosition.y = minmax(0, rotatedPosition.y - halfSize, rows - shipClass.size);
        break;
      }
      case ShipOrientation.Vertical: {
        rotatedPosition.x = minmax(0, rotatedPosition.x - halfSize, columns - shipClass.size);
        rotatedPosition.y = minmax(0, rotatedPosition.y + halfSize, rows - 1);
        break;
      }
      default: assertNever(orientation);
    }

    if (canPlaceShip(state.grid, newState, rotatedPosition, newOrientation)) {
      placeShip(state, shipIndex, rotatedPosition, newOrientation);
      return;
    }

    clearShipFromGrid(state.grid, oldState);
  }

  // eslint-disable-next-line no-param-reassign
  state.shipStates[shipIndex] = newState;
};

export default {};
