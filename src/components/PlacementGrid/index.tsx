import styled from 'styled-components';
import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import GameGrid from '../GameGrid';
import DraggableShip from './DraggableShip';
import PlacementGridContext, { IPlacementGridContext } from './PlacementGridContext';
import { RootState } from '../../store/store';

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
  const placedIDs = useSelector(({ shipPlacement }: RootState) => shipPlacement.placedIDs);
  const notPlacedIDs = useSelector(({ shipPlacement }: RootState) => shipPlacement.nonPlacedIDs);

  const componentContainerRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const contextValue: IPlacementGridContext = useMemo(() => ({
    componentContainerRef,
    gridContainerRef,
  }), []);

  return (
    <PlacementGridContext.Provider value={contextValue}>
      <div ref={componentContainerRef}>
        <GameGrid ref={gridContainerRef} $cols={columns} $rows={rows}>
          {
            placedIDs
              .map((shipID) => <DraggableShip key={shipID} id={shipID} />)
          }
        </GameGrid>
        <NavyGrid>
          {
            notPlacedIDs
              .map((shipID) => <DraggableShip key={shipID} id={shipID} />)
          }
          <RightSpacer />
        </NavyGrid>
      </div>
    </PlacementGridContext.Provider>
  );
};

export default PlacementGrid;
