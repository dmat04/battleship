import styled from 'styled-components';
import { animated } from '@react-spring/web';
import { useRef } from 'react';
import { ShipOrientation } from '../../../../__generated__/graphql';
import useShipDrag from '../../../../hooks/useShipDrag';
import ShipImage from './ShipImage';

const NavyHolderContainer = styled.div<{ $shipSize: number, $vertical: boolean }>`
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
  grid-row-end: ${(props) => (props.$vertical ? `span ${props.$shipSize + 1}` : 'span 2')};
  grid-column-end: ${(props) => (props.$vertical ? 'span 2' : `span ${props.$shipSize + 1}`)};
`;

interface ShipProps {
  $row: number;
  $col: number;
  $size: number;
  $vertical: boolean;
}

const ShipContainer = styled(animated.div)<ShipProps>`
    touch-action: none;
    grid-row-start: ${({ $row }) => ($row >= 0 ? $row + 1 : 'auto')};
    grid-row-end: ${({ $vertical, $size }) => ($vertical ? `span ${$size}` : 'span 1')};
    grid-column-start: ${({ $col }) => ($col >= 0 ? `${$col + 1}` : 'auto')};
    grid-column-end: ${({ $vertical, $size }) => ($vertical ? 'span 1' : `span ${$size}`)};
    display: flex;
    align-items: center;
    justify-content: center;
`;

interface PropTypes {
  id: string;
}

const DraggableShip = ({ id }: PropTypes) => {
  const shipContainerRef = useRef<HTMLDivElement | null>(null);
  const dragProps = useShipDrag({ id, shipContainerRef });

  if (dragProps === null) return null;

  const {
    ship,
    orientation,
    gridPosition,
    listeners,
    springProps,
    svgSpringProps,
  } = dragProps;

  if (gridPosition !== null) {
    return (
      <ShipContainer
        ref={shipContainerRef}
        style={springProps}
        $col={gridPosition.x}
        $row={gridPosition.y}
        $size={ship.size}
        $vertical={orientation === ShipOrientation.Vertical}
        {...listeners}
      >
        <ShipImage shipSize={ship.size} shipOrientation={orientation} pathStyle={svgSpringProps} />
      </ShipContainer>
    );
  }

  return (
    <NavyHolderContainer
      $shipSize={ship.size}
      $vertical={orientation === ShipOrientation.Vertical}
    >
      <div style={{ gridArea: '1 / 1 / 1 / -1' }} />
      <div style={{ gridArea: '2 / 1 / 2 / 1' }} />
      <ShipContainer
        ref={shipContainerRef}
        style={springProps}
        $col={-1}
        $row={-1}
        $size={ship.size}
        $vertical={orientation === ShipOrientation.Vertical}
        {...listeners}
      >
        <ShipImage shipSize={ship.size} shipOrientation={orientation} pathStyle={svgSpringProps} />
      </ShipContainer>
    </NavyHolderContainer>
  );
};

export default DraggableShip;
