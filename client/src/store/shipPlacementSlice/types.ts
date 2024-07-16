import { Ship, ShipOrientation } from '../../__generated__/graphql';

export interface Coordinates {
  x: number;
  y: number;
}

export interface PlaceShipArgs {
  shipID: Ship['shipID'];
  position: Coordinates;
}

export interface ShipState {
  ship: Ship;
  orientation: ShipOrientation;
  position: Coordinates | null;
}

export interface GridState {
  columns: number;
  rows: number;
  cellStates: (Ship['shipID'] | null)[][];
}

export interface SliceState {
  placedIDs: string[];
  nonPlacedIDs: string[];
  shipStates: ShipState[];
  grid: GridState;
}
