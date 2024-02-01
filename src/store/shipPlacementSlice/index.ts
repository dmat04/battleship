import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SliceState } from './types';
import {
  initializeState,
  processPlaceShipAction,
  processResetShipAction,
  processRotateShipAction,
} from './utils';
import { ShipPlacementInput, ShipsPlacedResult } from '../../__generated__/graphql';
import { fetchGameSettings } from '../gameRoomSlice';
import type { AppDispatch, RootState } from '../store';
import Dependencies from '../../utils/Dependencies';
import { PLACE_SHIPS } from '../../graphql/mutations';
import { initGame } from '../activeGameSlice';
import { GameInitArgs } from '../activeGameSlice/stateTypes';

export const submitPlacement = createAsyncThunk<
// eslint-disable-next-line @typescript-eslint/indent
  ShipsPlacedResult | undefined, string, { dispatch: AppDispatch, state: RootState }
>(
  'shipPlacement/submit',
  async (roomId: string, thunkAPI) => {
    const { shipStates } = thunkAPI.getState().shipPlacement;

    if (shipStates.some(({ position }) => position === null)) {
      return thunkAPI.rejectWithValue({ error: 'Cannot submit ship placement - not all ships placed' });
    }

    const { gameSettings } = thunkAPI.getState().gameRoom;
    const playerName = thunkAPI.getState().auth.loginResult?.username;

    if (!gameSettings || !playerName) {
      return thunkAPI.rejectWithValue({ error: 'Cannot submit ship placement - missing game room state' });
    }

    const shipPlacements: ShipPlacementInput[] = shipStates.map((shipState) => ({
      shipID: shipState.ship.shipID,
      orientation: shipState.orientation,
      x: shipState.position?.x ?? 0,
      y: shipState.position?.y ?? 0,
    }));

    const result = await Dependencies.getApolloClient()?.mutate({
      mutation: PLACE_SHIPS,
      variables: {
        roomId,
        shipPlacements,
      },
    });

    const shipPlacementResult = result?.data?.placeShips;

    if (shipPlacementResult) {
      const gameInitArgs: GameInitArgs = {
        playerName,
        gameSettings,
        gameRoomStatus: shipPlacementResult.gameRoomStatus,
        playerShips: shipPlacementResult.placedShips,
      };

      thunkAPI.dispatch(initGame(gameInitArgs));

      return shipPlacementResult;
    }

    return thunkAPI.rejectWithValue({ error: 'Ship placement submission failed' });
  },
);

const initialState: SliceState = {
  placedIDs: [],
  nonPlacedIDs: [],
  shipStates: [],
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
    rotateShip: processRotateShipAction,
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchGameSettings.fulfilled,
      (state, action) => initializeState(action.payload),
    );
  },
});

export const {
  placeShip,
  resetShip,
  rotateShip,
} = shipPlacementSlice.actions;

export default shipPlacementSlice.reducer;
