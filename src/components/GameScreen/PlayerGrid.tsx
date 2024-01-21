import styled from 'styled-components';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import GameGrid from '../GameGrid';
import { Theme } from '../assets/themes/themeDefault';
import { hitOpponentCell } from '../../store/activeGameSlice';
import { Coordinates } from '../../store/shipPlacementSlice/types';

const Container = styled.div<{ theme: Theme }>`
  grid-area: player;
  background-color: aliceblue;
  padding: ${(props) => props.theme.paddingMin};
`;

const CellContainer = styled.div<{ $col: number, $row: number }>`
  grid-column: ${(props) => props.$col + 1} / span 1;
  grid-row: ${(props) => props.$row + 1} / span 1;
`;

const GridCell = (position: Coordinates) => {
  const dispatch = useAppDispatch();

  const { x, y } = position;

  return (
    <CellContainer
      $col={x}
      $row={y}
      onClick={() => dispatch(hitOpponentCell(position))}
    />
  );
};

const PlayerGrid = () => {
  const settings = useAppSelector((state) => state.gameRoom.gameSettings);
  const { boardWidth, boardHeight } = settings ?? { boardWidth: 10, boardHeight: 10 };

  const coordinates = useMemo(() => {
    const arr: Coordinates[] = Array(boardHeight * boardWidth);
    for (let row = 0; row < boardHeight; row += 1) {
      for (let col = 0; col < boardWidth; col += 1) {
        arr[(row * boardWidth) + col] = { x: col, y: row };
      }
    }

    return arr;
  }, [boardWidth, boardHeight]);

  return (
    <Container>
      <GameGrid $rows={settings?.boardHeight ?? 10} $cols={settings?.boardWidth ?? 10}>
        {
          coordinates.map(({ x, y }) => <GridCell x={x} y={y} key={`PlayerCell-${x}-${y}`} />)
        }
      </GameGrid>
    </Container>
  );
};

export default PlayerGrid;
