import DroppableCell from './DroppableCell';

export const createDroppableCells = (rows: number, columns: number) => {
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < columns; c += 1) {
      cells.push(<DroppableCell column={c} row={r} key={`Cell-${r}-${c}`} />);
    }
  }

  return cells;
};

export default {};
