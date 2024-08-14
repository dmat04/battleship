import { Coordinate, GameSettings } from "@battleship/common/types/__generated__/types.generated.js";

export const calculateGridPosition = (
  ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
  gridElement: HTMLDivElement | null,
  settings: GameSettings | null | undefined,
): Coordinate | undefined => {
  if (!gridElement || !settings) return undefined;

  const { clientX, clientY } = ev;
  const { boardWidth, boardHeight } = settings;
  const { left, top, width, height } = gridElement.getBoundingClientRect();

  const cellWidth = width / boardWidth;
  const cellHeight = height / boardHeight;

  const boardX = clientX - left;
  const boardY = clientY - top;

  const column = Math.floor(boardX / cellWidth);
  const row = Math.floor(boardY / cellHeight);

  if (column < 0 || column >= boardWidth || row < 0 || row >= boardHeight)
    return undefined;

  return {
    x: column,
    y: row,
  };
};

export default {};
