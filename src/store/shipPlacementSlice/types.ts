import { ShipClass, ShipOrientation } from '../../__generated__/graphql';

export type ShipID = string;

export interface Coordinates {
  x: number;
  y: number;
}
export interface PlaceShipArgs {
  shipID: ShipID;
  position: Coordinates;
}

export interface ShipState {
  shipID: ShipID;
  shipClass: ShipClass;
  orientation: ShipOrientation;
  position: Coordinates | null;
}

export interface GridState {
  columns: number;
  rows: number;
  cellStates: (ShipID | null)[][];
}

export interface SliceState {
  shipStates: ShipState[];
  grid: GridState;
}
