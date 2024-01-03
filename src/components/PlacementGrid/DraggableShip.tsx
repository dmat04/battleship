import { useDraggable } from '@dnd-kit/core';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ShipOrientation } from '../../__generated__/graphql';
import { ShipState } from '../../store/shipPlacementSlice/types';

const ShipContainer = styled.div<{ $row: number, $col: number, $size: number, $vertical: boolean }>`
  background-color: lightslategray;
  touch-action: none;
  grid-row-start: ${(props) => (props.$row < 0 ? 'initial' : props.$row + 1)};
  grid-row-end: ${(props) => (props.$vertical ? `span ${props.$size}` : 'span 1')};
  grid-column-start: ${(props) => (props.$col < 0 ? 'initial' : props.$col + 1)};
  grid-column-end: ${(props) => (props.$vertical ? 'span 1' : `span ${props.$size}`)};
  transform: translate()
`;

interface PropTypes {
  id: string;
  color: string;
}

export interface ShipDragData {
  size: number;
  vertical: boolean;
  id: string;
}

const DraggableShip = ({ id, color }: PropTypes) => {
  // eslint-disable-next-line arrow-body-style
  const shipState = useSelector(({ shipPlacement }: RootState) => {
    return shipPlacement.shipStates.find((el) => el.shipID === id);
  });

  const {
    shipID,
    shipClass,
    orientation,
    position,
  } = shipState as ShipState;

  const draggableData: ShipDragData = {
    id: shipID,
    size: shipClass.size,
    vertical: orientation === ShipOrientation.Vertical,
  };

  const {
    attributes, listeners, setNodeRef, transform,
  } = useDraggable({
    id: shipID ?? '',
    data: draggableData,
  });

  if (!shipState) return null;

  const setVertical = () => {
    console.log('Dispatch orientation change');
  };

  const style = {
    zIndex: 1,
    boxShadow: '',
    backgroundColor: color,
    transform: transform !== null
      ? `translate(${transform?.x}px, ${transform?.y}px)`
      : 'translate(0, 0)',
  };

  return (
    <ShipContainer
      ref={setNodeRef}
      $row={position?.y ?? -1}
      $col={position?.x ?? -1}
      $size={shipClass.size}
      $vertical={orientation === ShipOrientation.Vertical}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={setVertical}
    />
  );
};

export default DraggableShip;
