import { createSlice } from '@reduxjs/toolkit';
import { SliceState } from './types';
import { processPlaceShipAction, processResetShipAction } from './utils';

const initialState: SliceState = {
  allShips: [],
  nonPlacedShips: [],
  placedShips: [],
  grid: {
    columns: 0,
    rows: 0,
    cellStates: [[]],
  },
};

const shipPlacementSlice = createSlice({
  name: 'shipPlacement',
  initialState,
  reducers: {
    placeShip: processPlaceShipAction,
    resetShip: processResetShipAction,
  },
});

export const { placeShip, resetShip } = shipPlacementSlice.actions;

export default shipPlacementSlice.reducer;
