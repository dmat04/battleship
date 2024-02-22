import styled from 'styled-components';
import { animated } from '@react-spring/web';
import { useRef } from 'react';
import { ShipOrientation } from '../../../../__generated__/graphql';
import useShipDrag from '../../../../hooks/useShipDrag';
import { ReactComponent as Ship1Horizontal } from '../../../assets/images/ship_1_horizontal.svg';
import { ReactComponent as Ship1Vertical } from '../../../assets/images/ship_1_vertical.svg';
import { ReactComponent as Ship2Horizontal } from '../../../assets/images/ship_2_horizontal.svg';
import { ReactComponent as Ship2Vertical } from '../../../assets/images/ship_2_vertical.svg';
import { ReactComponent as Ship3Horizontal } from '../../../assets/images/ship_3_horizontal.svg';
import { ReactComponent as Ship3Vertical } from '../../../assets/images/ship_3_vertical.svg';
import { ReactComponent as Ship4Horizontal } from '../../../assets/images/ship_4_horizontal.svg';
import { ReactComponent as Ship4Vertical } from '../../../assets/images/ship_4_vertical.svg';
import { ReactComponent as Ship5Horizontal } from '../../../assets/images/ship_5_horizontal.svg';
import { ReactComponent as Ship5Vertical } from '../../../assets/images/ship_5_vertical.svg';

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
    /* background-color: greenyellow; */
    /* opacity: 0.75; */

    & > svg {
      width: 90%;
      height: 90%;
    }

    & > svg > path {
      fill: #BDBDBD;
      stroke: black;
      stroke-width: 1.5;
    }
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
  } = dragProps;

  let ImageComponent = <Ship1Horizontal />;
  switch (ship.size) {
    case 2:
      ImageComponent = orientation === ShipOrientation.Vertical
        ? <Ship2Vertical />
        : <Ship2Horizontal />;
      break;
    case 3:
      ImageComponent = orientation === ShipOrientation.Vertical
        ? <Ship3Vertical />
        : <Ship3Horizontal />;
      break;
    case 4:
      ImageComponent = orientation === ShipOrientation.Vertical
        ? <Ship4Vertical />
        : <Ship4Horizontal />;
      break;
    case 5:
      ImageComponent = orientation === ShipOrientation.Vertical
        ? <Ship5Vertical />
        : <Ship5Horizontal />;
      break;
    default:
      ImageComponent = orientation === ShipOrientation.Vertical
        ? <Ship1Vertical />
        : <Ship1Horizontal />;
      break;
  }

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
        {ImageComponent}
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
        {ImageComponent}
      </ShipContainer>
    </NavyHolderContainer>
  );
};

export default DraggableShip;
