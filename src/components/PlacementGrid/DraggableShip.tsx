import { useDraggable } from '@dnd-kit/core';
import styled from 'styled-components';

const ShipContainer = styled.div<{ $row: number, $col: number, $size: number, $vertical: boolean }>`
  background-color: lightslategray;
  touch-action: none;
  grid-row-start: ${(props) => props.$row};
  grid-row-end: ${(props) => (props.$vertical ? `span ${props.$size}` : 'span 1')};
  grid-column-start: ${(props) => props.$col};
  grid-column-end: ${(props) => (props.$vertical ? 'span 1' : `span ${props.$size}`)};
  transform: translate()
`;

interface PropTypes {
  col: number;
  row: number;
  size: number;
  color: string;
  vertical: boolean;
  setVertical: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ShipDragData {
  size: number;
  vertical: boolean;
  id: string;
}

const DraggableShip = ({
  col, row, size, color, vertical, setVertical,
}: PropTypes) => {
  const {
    attributes, listeners, setNodeRef, transform,
  } = useDraggable({
    id: `Ship-${color}`,
    data: {
      size,
      vertical,
      id: `Ship-${color}`,
    },
  });

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
      $row={row}
      $col={col}
      $size={size}
      $vertical={vertical}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={() => setVertical(!vertical)}
    />
  );
};

export default DraggableShip;
