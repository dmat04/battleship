import { useDraggable } from '@dnd-kit/core';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ShipOrientation } from '../../__generated__/graphql';
import { ShipState } from '../../store/shipPlacementSlice/types';
import { rotateShip } from '../../store/shipPlacementSlice';

const ShipContainer = styled.div<{ $row: number, $col: number, $size: number, $vertical: boolean }>`
  background-color: lightslategray;
  touch-action: none;
  display: flex;
  grid-row-start: ${(props) => (props.$row < 0 ? 'initial' : props.$row + 1)};
  grid-row-end: ${(props) => (props.$vertical ? `span ${props.$size}` : 'span 1')};
  grid-column-start: ${(props) => (props.$col < 0 ? 'initial' : props.$col + 1)};
  grid-column-end: ${(props) => (props.$vertical ? 'span 1' : `span ${props.$size}`)};
  transform: translate()
`;

const DragNode = styled.div<{ $shipSize: number, $vertical: boolean }>`
  width: ${(props) => (props.$vertical ? '100%' : `calc(100% / ${props.$shipSize})`)};
  height: ${(props) => (props.$vertical ? `calc(100% / ${props.$shipSize})` : '100%')};
`;

interface PropTypes {
  id: string;
  color: string;
}

export interface ShipDragData {
  id: string;
  size: number;
  vertical: boolean;
  scale: number;
}

const DraggableShip = ({ id, color }: PropTypes) => {
  // eslint-disable-next-line arrow-body-style
  const shipState = useSelector(({ shipPlacement }: RootState) => {
    return shipPlacement.shipStates.find((el) => el.shipID === id);
  });
  const dispatch = useDispatch();

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
    scale: 1,
  };

  const {
    attributes, listeners, setNodeRef, transform, isDragging,
  } = useDraggable({
    id: shipID ?? '',
    data: draggableData,
  });

  if (!shipState) return null;

  const dispatchRotate = () => {
    if (shipClass.size > 1) {
      dispatch(rotateShip(shipID));
    }
  };

  const style = {
    zIndex: 1,
    boxShadow: '',
    backgroundColor: color,
    transform: '',
  };

  if (isDragging) {
    draggableData.scale = 1.1;
    style.transform = `
      translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)
      scale(${draggableData.scale})
    `;
    style.zIndex = 10;
    style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px'
  }

  return (
    <ShipContainer
      $row={position?.y ?? -1}
      $col={position?.x ?? -1}
      $size={shipClass.size}
      $vertical={orientation === ShipOrientation.Vertical}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={dispatchRotate}
    >
      <DragNode
        ref={setNodeRef}
        $shipSize={shipClass.size}
        $vertical={orientation === ShipOrientation.Vertical}
      />
    </ShipContainer>
  );
};

export default DraggableShip;
