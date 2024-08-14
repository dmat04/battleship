import type { Coordinate, PlacedShip } from './__generated__/types.generated.js'

export interface CellHitResult {
  position: Coordinate,
  hit: boolean,
  gameWon: boolean,
  shipSunk?: PlacedShip,
}