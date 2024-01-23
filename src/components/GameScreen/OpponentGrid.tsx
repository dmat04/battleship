import styled from 'styled-components';
import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import GameGrid from '../GameGrid';
import { Theme } from '../assets/themes/themeDefault';
import { opponentCellClicked } from '../../store/activeGameSlice';
import { ShipOrientation } from '../../__generated__/graphql';
import { calculateGridPosition } from './utils';

const Container = styled.div<{ theme: Theme }>`
  grid-area: opponent;
  background-color: blanchedalmond;
  padding: ${(props) => props.theme.paddingMin};
`;

const HitCell = styled.div<{ $col: number, $row: number }>`
  grid-column: ${(props) => props.$col + 1} / span 1;
  grid-row: ${(props) => props.$row + 1} / span 1;
  background-color: red;
`;

const MissedCell = styled.div<{ $col: number, $row: number }>`
  grid-column: ${(props) => props.$col + 1} / span 1;
  grid-row: ${(props) => props.$row + 1} / span 1;
  background-color: deepskyblue;
`;

const ShipContainer = styled.div<{
  $col: number,
  $row: number,
  $size: number,
  $orientation: ShipOrientation
}>`
  grid-row-start: ${(props) => props.$row + 1};
  grid-row-end: span ${(props) => (props.$orientation === ShipOrientation.Vertical
    ? props.$size
    : 1
  )};
  grid-column-start: ${(props) => props.$col + 1};
  grid-column-end: span ${(props) => (props.$orientation === ShipOrientation.Horizontal
    ? props.$size
    : 1
  )};
  background-color: slategrey;
`;

const OpponentGrid = () => {
  const {
    gameSettings,
    opponentGridState,
  } = useAppSelector((state) => state.activeGame);
  const dispatch = useAppDispatch();

  const gridRef = useRef<HTMLDivElement>(null);

  const { boardWidth, boardHeight } = gameSettings ?? { boardWidth: 10, boardHeight: 10 };

  const gridClickHandler: React.MouseEventHandler<HTMLDivElement> = useCallback((ev) => {
    const coords = calculateGridPosition(ev, gridRef.current, gameSettings);
    if (coords) dispatch(opponentCellClicked(coords));
  }, [gameSettings, dispatch]);

  return (
    <Container>
      <GameGrid
        ref={gridRef}
        onClick={gridClickHandler}
        $rows={boardHeight}
        $cols={boardWidth}
      >
        {
          opponentGridState.sunkenShips.map((ship) => (
            <ShipContainer
              key={`PlayerShip-${ship.x}-${ship.y}`}
              $col={ship.x}
              $row={ship.y}
              $orientation={ship.orientation}
              $size={ship.shipClass.size}
            />
          ))
        }
        {
          opponentGridState.hitCells.map(({ x, y }) => (
            <HitCell
              key={`PlayerHitCell-${x}-${y}`}
              $col={x}
              $row={y}
            />
          ))
        }
        {
          opponentGridState.missedCells.map(({ x, y }) => (
            <MissedCell
              key={`PlayerMissedCell-${x}-${y}`}
              $col={x}
              $row={y}
            />
          ))
        }
      </GameGrid>
    </Container>
  );
};

export default OpponentGrid;
