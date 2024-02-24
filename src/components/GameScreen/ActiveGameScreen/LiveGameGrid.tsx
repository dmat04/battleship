/* eslint-disable object-curly-newline */
import styled, { useTheme } from 'styled-components';
import { animated, useTransition } from '@react-spring/web';
import { useCallback, useRef } from 'react';
import { Coordinates } from '@dnd-kit/utilities';
import { PlacedShip } from '../../../__generated__/graphql';
import { opponentCellClicked } from '../../../store/gameRoomSlice';
import { GameRoomIsReady } from '../../../store/gameRoomSlice/stateTypes';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { assertNever } from '../../../utils/typeUtils';
import GameGrid from '../../GameGrid';
import { Theme } from '../../assets/themes/themeDefault';
import { calculateGridPosition } from './utils';
import Ship from '../Ship';

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

interface Props {
  owner: 'player' | 'opponent';
}

const LiveGameGrid = ({ owner }: Props) => {
  const dispatch = useAppDispatch();
  const gridRef = useRef<HTMLDivElement>(null);
  const theme = useTheme() as Theme;

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

  const playerShips = useAppSelector((state) => (owner === 'player'
    ? state.gameRoom.playerShips
    : undefined));

  const gridClickHandler: React.MouseEventHandler<HTMLDivElement> = useCallback((ev) => {
    if (owner === 'player') return;

    const coords = calculateGridPosition(ev, gridRef.current, settings);
    if (coords) dispatch(opponentCellClicked(coords));
  }, [dispatch, settings, owner]);

  const hitTransition = useTransition<Coordinates, any>(
    gridState?.hitCells ?? [],
    {
      keys: (coord: Coordinates) => `${owner}-hit-${coord.x}-${coord.y}`,
      from: theme.gameScreen.hitCellAnimStart,
      enter: theme.gameScreen.hitCellAnimSteps,
    },
  );

  const missTransition = useTransition<Coordinates, any>(
    gridState?.missedCells ?? [],
    {
      keys: (coord: Coordinates) => `${owner}-miss-${coord.x}-${coord.y}`,
      from: theme.gameScreen.missedCellAnimStart,
      enter: theme.gameScreen.missedCellAnimSteps,
    },
  );

  const [inaccessibleTransition, inaccessibleTransitionApi] = useTransition<Coordinates, any>(
    gridState?.inaccessibleCells ?? [],
    () => ({
      keys: (coord: Coordinates) => `${owner}-empty-${coord.x}-${coord.y}`,
      from: theme.gameScreen.missedCellAnimStart,
      enter: theme.gameScreen.missedCellAnimSteps,
    }),
  );

  const sinkTransition = useTransition<PlacedShip, any>(
    gridState?.sunkenShips ?? [],
    {
      keys: (ship: PlacedShip) => `${owner}-ship-${ship.x}-${ship.y}`,
      from: theme.gameScreen.sunkShipAnimStart,
      enter: theme.gameScreen.sunkShipAnimSteps,
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
            <Ship
              ref={() => { }}
              col={item.x}
              row={item.y}
              size={item.ship.size}
              orientation={item.orientation}
              containerStyle={style}
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
        {
          playerShips?.map((ship) => (
            <Ship
              ref={() => { }}
              key={ship.ship.shipID}
              col={ship.x}
              row={ship.y}
              size={ship.ship.size}
              orientation={ship.orientation}
            />
          ))
        }
      </GameGrid>
    </Container>
  );
};

export default LiveGameGrid;
