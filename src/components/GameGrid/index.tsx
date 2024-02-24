import styled from 'styled-components';
import React, { forwardRef, useMemo } from 'react';
import { Theme } from '../assets/themes/themeDefault';

const Cell = styled.div<{ $col: number, $row: number, theme: Theme }>`
  border-width: ${(props) => props.theme.gameGridLineThickness};
  border-color: ${(props) => props.theme.colors.shipBorder};
  border-style: solid;

  grid-row: ${(props) => props.$row + 1} / span 1;
  grid-column: ${(props) => props.$col + 1} / span 1;
  z-index: -1;
`;

const Container = styled.div<{ $cols: number, $rows: number, theme: Theme }>`
  --cols: ${(props) => props.$cols};
  --rows: ${(props) => props.$rows};
  --thickness: ${(props) => props.theme.gameGridLineThickness};
  --borderColor: ${(props) => props.theme.colors.shipBorder};
  
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
  aspect-ratio: 1;
  isolation: isolate;
  background-color: ${(props) => props.theme.colors.surfaceSecondary};
  border: var(--thickness) solid var(--borderColor);
`;

const generateCells = (columns: number, rows: number) => {
  const cells = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      cells.push(<Cell key={`GameGrid-Cell-${row}-${col}`} $col={col} $row={row} />);
    }
  }

  return cells;
};

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  columns: number;
  rows: number;
}

const GameGrid = forwardRef<HTMLDivElement, React.PropsWithChildren<Props>>((props, ref) => {
  const {
    columns,
    rows,
    children,
    ...rest
  } = props;
  const cells = useMemo(() => generateCells(columns, rows), [columns, rows]);

  return (
    <Container $cols={columns} $rows={rows} ref={ref} {...rest}>
      {cells}
      {children}
    </Container>
  );
});

export default GameGrid;
