import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SliceState } from './types';
import {
  initializeState,
  processPlaceShipAction,
  processResetShipAction,
  processRotateShipAction,
} from './utils';
import { GameRoomStatus, InputShipPlacement } from '../../__generated__/graphql';
import { fetchGameSettings } from '../gameRoomSlice';
import type { AppDispatch, RootState } from '../store';
import Dependencies from '../../utils/Dependencies';
import { PLACE_SHIPS } from '../../graphql/mutations';
import { initGame } from '../activeGameSlice';
import { GameInitArgs } from '../activeGameSlice/stateTypes';

export const submitPlacement = createAsyncThunk<
// eslint-disable-next-line @typescript-eslint/indent
  GameRoomStatus | undefined, string, { dispatch: AppDispatch, state: RootState }
>(
  'shipPlacement/submit',
  async (roomId: string, thunkAPI) => {
    const { shipStates } = thunkAPI.getState().shipPlacement;

    if (shipStates.some(({ position }) => position === null)) {
      thunkAPI.rejectWithValue({ error: 'Cannot submit ship placement - not all ships placed' });
    }

    const shipPlacements: InputShipPlacement[] = shipStates.map((ship) => ({
      shipClass: ship.shipClass.type,
      orientation: ship.orientation,
      x: ship.position?.x ?? 0,
      y: ship.position?.y ?? 0,
    }));

    const result = await Dependencies.getApolloClient()?.mutate({
      mutation: PLACE_SHIPS,
      variables: {
        roomId,
        shipPlacements,
      },
    });

    const gameRoomStatus = result?.data?.placeShips;
    const { gameSettings } = thunkAPI.getState().gameRoom;
    const playerName = thunkAPI.getState().auth.loginResult?.username;

    if (gameRoomStatus && gameSettings && playerName) {
      const gameInitArgs: GameInitArgs = {
        playerName,
        gameRoomStatus,
        gameSettings,
        playerShips: shipStates,
      };

      thunkAPI.dispatch(initGame(gameInitArgs));
    }

    return result?.data?.placeShips;
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
