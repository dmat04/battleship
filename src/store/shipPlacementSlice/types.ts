import { ShipClass, ShipOrientation } from '../../__generated__/graphql';

export type ShipID = string;

export interface PlaceShipArgs {
  shipID: ShipID;
  x: number;
  y: number;
}

export interface ShipStateBase {
  shipID: ShipID;
  shipClass: ShipClass;
  orientation: ShipOrientation;
}

export interface ShipStateNotPlaced extends ShipStateBase {
  placed: false;
}

export interface ShipStatePlaced extends ShipStateBase {
  placed: true;
  x: number;
  y: number;
}

export type ShipState = ShipStatePlaced | ShipStateNotPlaced;

export interface GridState {
  columns: number;
  rows: number;
  cellStates: (ShipID | null)[][];
}

export interface SliceState {
  allShips: ShipState[];
  nonPlacedShips: ShipStateNotPlaced[];
  placedShips: ShipStatePlaced[];
  grid: GridState;
}
