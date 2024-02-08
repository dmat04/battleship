import { createAsyncThunk } from '@reduxjs/toolkit';
import { ShipsPlacedResult, ShipPlacementInput } from '../../__generated__/graphql';
import { PLACE_SHIPS } from '../../graphql/mutations';
import Dependencies from '../../utils/Dependencies';
import type { AppDispatch, RootState } from '../store';

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

    if (!result?.data?.placeShips) {
      return thunkAPI.rejectWithValue({ error: 'Ship placement submission failed' });
    }

    return result.data.placeShips;
  },
);

export default {};
