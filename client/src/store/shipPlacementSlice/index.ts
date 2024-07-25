import { createSlice } from "@reduxjs/toolkit";
import { SliceState } from "./types.js";
import {
  initializeState,
  processPlaceShipAction,
  processResetShipAction,
  processResetShipsAction,
  processRotateShipAction,
} from "./utils.js";
import { fetchGameSettings } from "../gameRoomSlice/thunks.js";

const initialState: SliceState = {
  placedIDs: [],
  nonPlacedIDs: [],
  shipStates: [],
  grid: {
    columns: 0,
    rows: 0,
    cellStates: [],
  },
};

const shipPlacementSlice = createSlice({
  name: "shipPlacement",
  initialState,
  reducers: {
    placeShip: processPlaceShipAction,
    resetShip: processResetShipAction,
    rotateShip: processRotateShipAction,
    resetShips: processResetShipsAction,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGameSettings.fulfilled, (_, action) =>
      initializeState(action.payload),
    );
  },
});

export const { placeShip, resetShip, rotateShip, resetShips } =
  shipPlacementSlice.actions;

export default shipPlacementSlice.reducer;
