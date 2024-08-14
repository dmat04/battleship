import { styled } from "styled-components";
import { SpringValues, animated } from "@react-spring/web";
import { forwardRef } from "react";
import ShipImage from "./ShipImage.js";
import { ShipOrientation } from "@battleship/common/types/__generated__/types.generated.js";


interface ContainerProps {
  $row: number;
  $col: number;
  $size: number;
  $vertical: boolean;
}

const ShipContainer = styled(animated.div)<ContainerProps>`
  touch-action: none;
  grid-row-start: ${({ $row }) => ($row >= 0 ? $row + 1 : "auto")};
  grid-row-end: ${({ $vertical, $size }) =>
    $vertical ? `span ${$size}` : "span 1"};
  grid-column-start: ${({ $col }) => ($col >= 0 ? `${$col + 1}` : "auto")};
  grid-column-end: ${({ $vertical, $size }) =>
    $vertical ? "span 1" : `span ${$size}`};
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ShipProps {
  row: number;
  col: number;
  size: number;
  orientation: ShipOrientation;
  containerStyle?:
    | React.CSSProperties
    | SpringValues<{ [key: symbol]: string | number }>;
  imageStyle?:
    | React.CSSProperties
    | SpringValues<{ [key: symbol]: string | number }>;
  listeners?: Record<string, React.EventHandler<React.SyntheticEvent>>;
}

const Ship = forwardRef<HTMLDivElement, ShipProps>(
  (
    {
      row,
      col,
      size,
      orientation,
      containerStyle,
      imageStyle,
      listeners,
    }: ShipProps,
    ref,
  ) => (
    <ShipContainer
      ref={ref}
      style={containerStyle}
      {...listeners}
      $row={row}
      $col={col}
      $size={size}
      $vertical={orientation === ShipOrientation.Vertical}
    >
      <ShipImage
        shipSize={size}
        shipOrientation={orientation}
        pathStyle={imageStyle ?? {}}
      />
    </ShipContainer>
  ),
);

export default Ship;
