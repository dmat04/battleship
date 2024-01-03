import { useDroppable } from '@dnd-kit/core';
import styled from 'styled-components';

const Cell = styled.div<{ $row: number, $column: number }>`
  grid-row: ${(props) => props.$row + 1};
  grid-column: ${(props) => props.$column + 1};
`;

interface PropTypes {
  row: number,
  column: number,
}

const DroppableCell = ({ row, column }: PropTypes) => {
  const { setNodeRef } = useDroppable({
    id: `DroppableCell-${row}-${column}`,
    data: { row, column },
  });

  return <Cell $row={row} $column={column} ref={setNodeRef} />;
};

export default DroppableCell;
