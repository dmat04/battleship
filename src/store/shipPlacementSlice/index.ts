import { createSlice } from '@reduxjs/toolkit';
import { SliceState } from './types';
import { processPlaceShipAction, processResetShipAction, processRotateShipAction } from './utils';
import { ShipClassName, ShipOrientation } from '../../__generated__/graphql';

const stateStub: SliceState = {
  shipStates: [
    { orientation: ShipOrientation.Horizontal, shipClass: { size: 5, type: ShipClassName.Carrier }, position: null, shipID: 'CARRIER-1' },
    { orientation: ShipOrientation.Horizontal, shipClass: { size: 4, type: ShipClassName.Battleship }, position: null, shipID: 'BATTLESHIP-1' },
    { orientation: ShipOrientation.Horizontal, shipClass: { size: 3, type: ShipClassName.Cruiser }, position: null, shipID: 'CRUISER-1' },
    { orientation: ShipOrientation.Horizontal, shipClass: { size: 2, type: ShipClassName.Destroyer }, position: null, shipID: 'DESTROYER-1' },
    { orientation: ShipOrientation.Horizontal, shipClass: { size: 2, type: ShipClassName.Destroyer }, position: null, shipID: 'DESTROYER-2' },
    { orientation: ShipOrientation.Horizontal, shipClass: { size: 1, type: ShipClassName.Submarine }, position: null, shipID: 'SUBMARINE-1' },
    { orientation: ShipOrientation.Horizontal, shipClass: { size: 1, type: ShipClassName.Submarine }, position: null, shipID: 'SUBMARINE-2' },
  ],
  grid: {
    columns: 10,
    rows: 10,
    cellStates: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ],
  },
};

const initialState: SliceState = {
  shipStates: [],
  grid: {
    columns: 0,
    rows: 0,
    cellStates: [[]],
  },
};

const shipPlacementSlice = createSlice({
  name: 'shipPlacement',
  initialState: stateStub,
  reducers: {
    placeShip: processPlaceShipAction,
    resetShip: processResetShipAction,
    rotateShip: processRotateShipAction,
  },
});

export const { placeShip, resetShip, rotateShip } = shipPlacementSlice.actions;

export default shipPlacementSlice.reducer;
