import styled from 'styled-components';
import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import GameGrid from '../GameGrid';
import DraggableShip from './DraggableShip';
import PlacementGridContext, { IPlacementGridContext } from './PlacementGridContext';
import type { RootState } from '../../store/store';

const Container = styled.div`
  width: 35vh;
  margin: auto;
`;

const NavyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(8, 1fr);
  grid-auto-flow: dense;
  aspect-ratio: 10 / 8;
`;

const RightSpacer = styled.div`
  grid-area: 1 / 10 / span 10 / span 1;
`;

const PlacementGrid = () => {
  // eslint-disable-next-line arrow-body-style
  const columns = useSelector(({ shipPlacement }: RootState) => shipPlacement.grid.columns);
  const rows = useSelector(({ shipPlacement }: RootState) => shipPlacement.grid.rows);
  const ships = useSelector(({ shipPlacement }: RootState) => shipPlacement.shipStates);

  const componentContainerRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const contextValue: IPlacementGridContext = useMemo(() => ({
    componentContainerRef,
    gridContainerRef,
  }), []);

  return (
    <PlacementGridContext.Provider value={contextValue}>
      <Container ref={componentContainerRef}>
        <GameGrid ref={gridContainerRef} $cols={columns} $rows={rows}>
          {
            ships
              .filter(({ position }) => position !== null)
              .map(({ shipID, orientation, position }) => (
                <DraggableShip
                  key={`${shipID}-${position?.x}-${position?.y}-${orientation}`}
                  id={shipID}
                />
              ))
          }
        </GameGrid>
        <NavyGrid>
          {
            ships
              .filter(({ position }) => position === null)
              .map(({ shipID, orientation }) => (
                <DraggableShip
                  key={`${shipID}-${orientation}`}
                  id={shipID}
                />
              ))
          }
          <RightSpacer />
        </NavyGrid>
      </Container>
    </PlacementGridContext.Provider>
  );
};

export default PlacementGrid;
