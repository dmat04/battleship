import { Coordinate, Ship, ShipOrientation } from "@battleship/common/types/__generated__/types.generated.js";

export interface PlaceShipArgs {
  shipID: Ship["shipID"];
  position: Coordinate;
}

export interface ShipState {
  ship: Ship;
  orientation: ShipOrientation;
  position: Coordinate | null;
}

export interface GridState {
  columns: number;
  rows: number;
  cellStates: (Ship["shipID"] | null)[][];
}

export interface SliceState {
  placedIDs: string[];
  nonPlacedIDs: string[];
  shipStates: ShipState[];
  grid: GridState;
}
