/* eslint-disable object-curly-newline */
import styled, { useTheme } from 'styled-components';
import { animated, useTransition } from '@react-spring/web';
import { useCallback, useRef } from 'react';
import { Coordinates } from '@dnd-kit/utilities';
import { ShipOrientation, PlacedShip } from '../../../__generated__/graphql';
import { opponentCellClicked } from '../../../store/gameRoomSlice';
import { GameRoomIsReady } from '../../../store/gameRoomSlice/stateTypes';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { assertNever } from '../../../utils/typeUtils';
import GameGrid from '../../GameGrid';
import { Theme } from '../../assets/themes/themeDefault';
import { calculateGridPosition } from './utils';

const Container = styled.div<{ $owner: Props['owner'], $active: boolean }>`
  grid-area: ${(props) => props.$owner};
  opacity: ${(props) => (props.$active ? 1 : 0.5)};
  transition: opacity 0.5s;
`;

const Cell = styled(animated.div) <{ $col: number, $row: number }>`
  grid-column: ${(props) => props.$col + 1} / span 1;
  grid-row: ${(props) => props.$row + 1} / span 1;
  z-index: 2;
`;

const ShipContainer = styled(animated.div) <{
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
  z-index: 1;
`;

interface Props {
  owner: 'player' | 'opponent';
}

const LiveGameGrid = ({ owner }: Props) => {
  const dispatch = useAppDispatch();
  const gridRef = useRef<HTMLDivElement>(null);
  const { gameScreenTheme: theme } = useTheme() as Theme;

  const { gameStarted, currentPlayer } = useAppSelector((state) => state.gameRoom);
  const ownerName = useAppSelector((state) => {
    switch (owner) {
      case 'player': return state.gameRoom.playerName;
      case 'opponent': return state.gameRoom.opponentName;
      default: return assertNever(owner);
    }
  });

  const settings = useAppSelector((state) => state.gameRoom.gameSettings);
  const gridState = useAppSelector((state) => {
    if (!GameRoomIsReady(state.gameRoom)) return null;

    switch (owner) {
      case 'player': return state.gameRoom.playerScore;
      case 'opponent': return state.gameRoom.opponentScore;
      default: return assertNever(owner);
    }
  });

  const gridClickHandler: React.MouseEventHandler<HTMLDivElement> = useCallback((ev) => {
    if (owner === 'player') return;

    const coords = calculateGridPosition(ev, gridRef.current, settings);
    if (coords) dispatch(opponentCellClicked(coords));
  }, [dispatch, settings, owner]);

  const hitTransition = useTransition<Coordinates, any>(
    gridState?.hitCells ?? [],
    {
      keys: (coord: Coordinates) => `${owner}-hit-${coord.x}-${coord.y}`,
      from: theme.hitCellAnimStart,
      enter: theme.hitCellAnimSteps,
    },
  );

  const missTransition = useTransition<Coordinates, any>(
    gridState?.missedCells ?? [],
    {
      keys: (coord: Coordinates) => `${owner}-miss-${coord.x}-${coord.y}`,
      from: theme.missedCellAnimStart,
      enter: theme.missedCellAnimSteps,
    },
  );

  const [inaccessibleTransition, inaccessibleTransitionApi] = useTransition<Coordinates, any>(
    gridState?.inaccessibleCells ?? [],
    () => ({
      keys: (coord: Coordinates) => `${owner}-empty-${coord.x}-${coord.y}`,
      from: theme.missedCellAnimStart,
      enter: theme.missedCellAnimSteps,
    }),
  );

  const sinkTransition = useTransition<PlacedShip, any>(
    gridState?.sunkenShips ?? [],
    {
      keys: (ship: PlacedShip) => `${owner}-ship-${ship.x}-${ship.y}`,
      from: theme.sunkShipAnimStart,
      enter: theme.sunkShipAnimSteps,
      onRest: () => { inaccessibleTransitionApi.start(); },
    },
  );

  const { boardWidth, boardHeight } = settings ?? { boardWidth: 10, boardHeight: 10 };

  const active = gameStarted && currentPlayer !== ownerName;

  return (
    <Container $owner={owner} $active={active}>
      <GameGrid
        ref={gridRef}
        onClick={gridClickHandler}
        $rows={boardHeight}
        $cols={boardWidth}
      >
        {
          sinkTransition((style, item) => (
            <ShipContainer
              style={style}
              $col={item.x}
              $row={item.y}
              $orientation={item.orientation}
              $size={item.ship.size}
            />
          ))
        }
        {
          hitTransition((style, item) => (
            <Cell
              style={style}
              $col={item.x}
              $row={item.y}
            />
          ))
        }
        {
          missTransition((style, item) => (
            <Cell
              style={style}
              $col={item.x}
              $row={item.y}
            />
          ))
        }
        {
          inaccessibleTransition((style, item) => (
            <Cell
              style={style}
              $col={item.x}
              $row={item.y}
            />
          ))
        }
      </GameGrid>
    </Container>
  );
};

export default LiveGameGrid;
