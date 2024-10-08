import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ShipsPlacedResult,
  ShipPlacementInput,
  PlaceShipsMutation,
} from "@battleship/common/types/__generated__/types.generated.js";
import { PLACE_SHIPS } from "../../graphql/mutations.js";
import Dependencies from "../../utils/Dependencies.js";
import type { ThunkAPI } from "../store.js";
import { resetShips } from "./index.js";

export const submitPlacement = createAsyncThunk<
  ShipsPlacedResult | undefined,
  string,
  ThunkAPI
>("shipPlacement/submit", async (roomId: string, thunkAPI) => {
  const { shipStates } = thunkAPI.getState().shipPlacement;

  if (shipStates.some(({ position }) => position === null)) {
    return thunkAPI.rejectWithValue({
      error: "Cannot submit ship placement - not all ships placed",
    });
  }

  const { gameSettings } = thunkAPI.getState().gameRoom;
  const playerName = thunkAPI.getState().auth.loginResult?.username;

  if (!gameSettings || !playerName) {
    return thunkAPI.rejectWithValue({
      error: "Cannot submit ship placement - missing game room state",
    });
  }

  const shipPlacements: ShipPlacementInput[] = shipStates.map((shipState) => ({
    shipID: shipState.ship.shipID,
    orientation: shipState.orientation,
    position: {
      x: shipState.position?.x ?? 0,
      y: shipState.position?.y ?? 0,
    },
  }));

  const result = await Dependencies.getApolloClient()?.mutate<PlaceShipsMutation>({
    mutation: PLACE_SHIPS,
    variables: {
      roomId,
      shipPlacements,
    },
  });

  if (!result?.data?.placeShips) {
    return thunkAPI.rejectWithValue({
      error: "Ship placement submission failed",
    });
  }

  thunkAPI.dispatch(resetShips());

  return result.data.placeShips;
});

export default {};
