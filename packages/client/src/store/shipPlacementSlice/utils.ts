/* eslint-disable no-param-reassign */
import { PayloadAction } from "@reduxjs/toolkit";
import {
  PlaceShipArgs,
  GridState,
  ShipState,
  SliceState,
} from "./types.js";
import {
  Coordinate,
  GameSettings,
  Ship,
  ShipOrientation,
} from "@battleship/common/types/__generated__/types.generated.js";
import { assertNever } from "@battleship/common/utils/typeUtils.js";

const minmax = (min: number, value: number, max: number): number =>
  // eslint-disable-next-line implicit-arrow-linebreak
  Math.max(min, Math.min(max, value));

export const canPlaceShip = (
  grid: GridState,
  shipState: ShipState,
  { x, y }: Coordinate,
  orientation: ShipOrientation = shipState.orientation,
): boolean => {
  const { columns, rows, cellStates } = grid;
  const { shipID, size } = shipState.ship;

  let vSize = 0;
  let hSize = 0;

  switch (orientation) {
    case ShipOrientation.Horizontal:
      vSize = 1;
      hSize = size;
      break;
    case ShipOrientation.Vertical:
      vSize = size;
      hSize = 1;
      break;
    default:
      assertNever(orientation);
  }

  if (x + hSize > columns || x < 0 || y + vSize > rows || y < 0) {
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
  { x, y }: Coordinate,
  orientation: ShipOrientation,
  size: number,
  value: Ship["shipID"] | null,
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
    default:
      assertNever(orientation);
  }
};

const clearShipFromGrid = (grid: GridState, shipState: ShipState): void => {
  if (!shipState.position) return;

  fillGrid(
    grid,
    shipState.position,
    shipState.orientation,
    shipState.ship.size,
    null,
  );
};

const populateGridWithShip = (grid: GridState, shipState: ShipState): void => {
  if (!shipState.position) return;

  fillGrid(
    grid,
    shipState.position,
    shipState.orientation,
    shipState.ship.size,
    shipState.ship.shipID,
  );
};

const placeShip = (
  state: SliceState,
  shipIndex: number,
  { x, y }: Coordinate,
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

  state.nonPlacedIDs = state.nonPlacedIDs.filter(
    (id) => id !== newState.ship.shipID,
  );
  if (state.placedIDs.findIndex((val) => val === newState.ship.shipID) < 0) {
    state.placedIDs.push(newState.ship.shipID);
  }

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

  state.placedIDs = state.placedIDs.filter((id) => id !== newState.ship.shipID);
  if (state.nonPlacedIDs.findIndex((val) => val === newState.ship.shipID) < 0) {
    state.nonPlacedIDs.push(newState.ship.shipID);
  }

  // eslint-disable-next-line no-param-reassign
  state.shipStates[shipIndex] = newState;
  clearShipFromGrid(state.grid, oldState);
};

export const processPlaceShipAction = (
  state: SliceState,
  { payload }: PayloadAction<PlaceShipArgs>,
) => {
  const shipIndex = state.shipStates.findIndex(
    ({ ship }) => ship.shipID === payload.shipID,
  );
  if (shipIndex < 0) return;

  const shipState = state.shipStates[shipIndex];
  if (!canPlaceShip(state.grid, shipState, payload.position)) return;

  placeShip(state, shipIndex, payload.position);
};

export const processResetShipAction = (
  state: SliceState,
  { payload }: PayloadAction<Ship["shipID"]>,
) => {
  const shipIndex = state.shipStates.findIndex(
    ({ ship }) => ship.shipID === payload,
  );
  if (shipIndex < 0) return;

  displaceShip(state, shipIndex);
};

export const processRotateShipAction = (
  state: SliceState,
  { payload }: PayloadAction<Ship["shipID"]>,
) => {
  const shipIndex = state.shipStates.findIndex(
    ({ ship }) => ship.shipID === payload,
  );
  if (shipIndex < 0) return;

  const oldState = state.shipStates[shipIndex];
  const { ship, orientation, position } = oldState;

  let newOrientation = orientation;
  switch (orientation) {
    case ShipOrientation.Horizontal:
      newOrientation = ShipOrientation.Vertical;
      break;
    case ShipOrientation.Vertical:
      newOrientation = ShipOrientation.Horizontal;
      break;
    default:
      assertNever(orientation);
  }

  const newState: ShipState = {
    ship,
    orientation: newOrientation,
    position: null,
  };

  if (position) {
    const { rows, columns } = state.grid;
    const halfSize = Math.floor(ship.size / 2);
    const rotatedPosition = { ...position };

    switch (orientation) {
      case ShipOrientation.Horizontal: {
        rotatedPosition.x = minmax(
          0,
          rotatedPosition.x + halfSize,
          columns - 1,
        );
        rotatedPosition.y = minmax(
          0,
          rotatedPosition.y - halfSize,
          rows - ship.size,
        );
        break;
      }
      case ShipOrientation.Vertical: {
        rotatedPosition.x = minmax(
          0,
          rotatedPosition.x - halfSize,
          columns - ship.size,
        );
        rotatedPosition.y = minmax(0, rotatedPosition.y + halfSize, rows - 1);
        break;
      }
      default:
        assertNever(orientation);
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

export const processResetShipsAction = (state: SliceState) => {
  let id = state.placedIDs.pop();
  while (id) {
    if (!state.nonPlacedIDs.includes(id)) state.nonPlacedIDs.push(id);
    id = state.placedIDs.pop();
  }

  state.shipStates.forEach((shipState) => {
    shipState.position = null;
    shipState.orientation = ShipOrientation.Horizontal;
  });

  state.grid.cellStates.forEach((row) => {
    row.forEach((_, idx) => {
      row[idx] = null;
    });
  });
};

export const initializeState = (gameSettings: GameSettings): SliceState => {
  const shipStates: ShipState[] = gameSettings.availableShips.map(
    (availableShip) => ({
      ship: availableShip,
      position: null,
      orientation: ShipOrientation.Horizontal,
    }),
  );

  shipStates.sort((a, b) => b.ship.size - a.ship.size);
  const nonPlacedIDs = shipStates.map((state) => state.ship.shipID);

  const cellStates: Array<Array<null>> = new Array<Array<null>>(gameSettings.boardHeight);
  for (let i = 0; i < gameSettings.boardHeight; i += 1) {
    cellStates[i] = new Array<null>(gameSettings.boardWidth).fill(null);
  }

  const grid: GridState = {
    columns: gameSettings.boardWidth,
    rows: gameSettings.boardHeight,
    cellStates,
  };

  const state: SliceState = {
    placedIDs: [],
    nonPlacedIDs,
    shipStates,
    grid,
  };

  return state;
};
