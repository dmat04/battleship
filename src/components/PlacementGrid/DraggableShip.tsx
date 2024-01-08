import styled from 'styled-components';
import { animated } from '@react-spring/web';
import { useRef } from 'react';
import { ShipOrientation } from '../../__generated__/graphql';
import useShipDrag from '../../hooks/useShipDrag';

const NavyHolderContainer = styled.div<{ $shipSize: number, $vertical: boolean }>`
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
  grid-row-end: ${(props) => (props.$vertical ? `span ${props.$shipSize + 1}` : 'span 2')};
  grid-column-end: ${(props) => (props.$vertical ? 'span 2' : `span ${props.$shipSize + 1}`)};
`;

const generateStyle = (row: number, col: number, size: number, vertical: boolean) => ({
  backgroundColor: 'lightslategray',
  display: 'flex',
  borderStyle: 'solid',
  borderWidth: '3px',
  borderColor: 'transparent',
  gridRowStart: row >= 0 ? `${row + 1}` : 'initial',
  gridRowEnd: vertical ? `span ${size}` : 'span 1',
  gridColumnStart: col >= 0 ? `${col + 1}` : 'initial',
  gridColumnEnd: vertical ? 'span 1' : `span ${size}`,
});

interface PropTypes {
  id: string;
}

const DraggableShip = ({ id }: PropTypes) => {
  const shipContainerRef = useRef<HTMLDivElement | null>(null);
  const dragProps = useShipDrag({ id, shipContainerRef });

  if (dragProps === null) return null;

  const initialStyle = generateStyle(
    dragProps.gridPosition?.y ?? -1,
    dragProps.gridPosition?.x ?? -1,
    dragProps.shipClass.size,
    dragProps.orientation === ShipOrientation.Vertical,
  );

  const {
    shipClass,
    orientation,
    gridPosition,
    listeners,
    springProps,
  } = dragProps;

  if (gridPosition !== null) {
    return (
      <animated.div
        ref={shipContainerRef}
        {...listeners}
        style={{ ...initialStyle, ...springProps }}
      />
    );
  }

  return (
    <NavyHolderContainer
      $shipSize={shipClass.size}
      $vertical={orientation === ShipOrientation.Vertical}
    >
      <div style={{ gridArea: '1 / 1 / 1 / -1' }} />
      <div style={{ gridArea: '2 / 1 / 2 / 1' }} />
      <animated.div
        ref={shipContainerRef}
        {...listeners}
        style={{ ...initialStyle, ...springProps }}
      />
    </NavyHolderContainer>
  );
};

export default DraggableShip;
