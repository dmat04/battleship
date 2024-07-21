import { Coordinates, GridState } from "../../store/shipPlacementSlice/types";

export const calculateTranslation = (
  startPos: Coordinates,
  ev: React.PointerEvent,
  shipRect: DOMRect,
  containerRect: DOMRect,
): { dx: number; dy: number } => {
  let dx = ev.clientX - startPos.x;
  let dy = ev.clientY - startPos.y;

  if (shipRect.left + dx < containerRect.left) {
    dx = containerRect.left - shipRect.left;
  } else if (shipRect.right + dx > containerRect.right) {
    dx = containerRect.right - shipRect.right;
  }

  if (shipRect.top + dy < containerRect.top) {
    dy = containerRect.top - shipRect.top;
  } else if (shipRect.bottom + dy > containerRect.bottom) {
    dy = containerRect.bottom - shipRect.bottom;
  }

  return { dx, dy };
};

export const calculateGridPosition = (
  grid: GridState,
  shipRect: DOMRect,
  gridRect: DOMRect,
  dx: number,
  dy: number,
): {
  gridPosition: Coordinates;
  dxSnapped: number;
  dySnapped: number;
} => {
  const cellSize = gridRect.width / grid.columns;
  const gridX = shipRect.left + dx - gridRect.left;
  const gridY = shipRect.top + dy - gridRect.top;

  const gridPosition = {
    x: Math.round(gridX / cellSize),
    y: Math.round(gridY / cellSize),
  };

  const dxSnapped = cellSize * gridPosition.x - shipRect.left + gridRect.left;
  const dySnapped = cellSize * gridPosition.y - shipRect.top + gridRect.top;

  return {
    gridPosition,
    dxSnapped,
    dySnapped,
  };
};

export const isWithinGrid = ({ x, y }: Coordinates, grid: GridState) =>
  x >= 0 && x < grid.columns && y >= 0 && y < grid.rows;
