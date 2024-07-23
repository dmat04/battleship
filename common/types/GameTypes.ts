import type { PlacedShip } from './__generated__/types.generated.js'

export interface CellHitResult {
  x: number,
  y: number,
  hit: boolean,
  gameWon: boolean,
  shipSunk?: PlacedShip,
}