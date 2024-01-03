import styled from 'styled-components';
import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import GameGrid from '../GameGrid';
import DNDContext from './DNDContext';
import DraggableShip from './DraggableShip';
import { createDroppableCells } from './utils';
import PlacementGridContext, { IPlacementGridContext } from './PlacementGridContext';
import { RootState } from '../../store/store';
import { ShipState } from '../../store/shipPlacementSlice/types';
import { ShipOrientation } from '../../__generated__/graphql';

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

const NavyHolderContainer = styled.div<{ $shipSize: number, $vertical: boolean, $color: string }>`
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
  grid-row-end: ${(props) => (props.$vertical ? `span ${props.$shipSize + 1}` : 'span 2')};
  grid-column-end: ${(props) => (props.$vertical ? 'span 2' : `span ${props.$shipSize + 1}`)};
`;

interface NavyHolderProps {
  shipState: ShipState;
}

const NavyHolder = ({ shipState }: NavyHolderProps) => (
  <NavyHolderContainer
    $shipSize={shipState.shipClass.size}
    $vertical={shipState.orientation === ShipOrientation.Vertical}
    $color="red"
  >
    <div style={{ gridArea: '1 / 1 / 1 / -1' }} />
    <div style={{ gridArea: '2 / 1 / 2 / 1' }} />
    <DraggableShip id={shipState.shipID} color="red" />
  </NavyHolderContainer>
);

const Cells = ({ rows, columns }: { rows: number, columns: number }) => (
  <>
    {createDroppableCells(rows, columns)}
  </>
);

const PlacementGrid = () => {
  // eslint-disable-next-line arrow-body-style
  const columns = useSelector(({ shipPlacement }: RootState) => shipPlacement.grid.columns);
  const rows = useSelector(({ shipPlacement }: RootState) => shipPlacement.grid.rows);
  const shipStates = useSelector(({ shipPlacement }: RootState) => shipPlacement.shipStates);

  const componentContainerRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const contextValue: IPlacementGridContext = useMemo(() => ({
    componentContainerRef,
    gridContainerRef,
  }), []);

  return (
    <PlacementGridContext.Provider value={contextValue}>
      <DNDContext>
        <div ref={componentContainerRef}>
          <GameGrid ref={gridContainerRef} $cols={columns} $rows={rows}>
            <Cells rows={rows} columns={columns} />
            {
              shipStates
                .filter((ship) => ship.position !== null)
                .map(({ shipID }) => <DraggableShip key={shipID} id={shipID} color="black" />)
            }
          </GameGrid>
          <NavyGrid>
            {
              shipStates
                .filter((ship) => ship.position === null)
                .map((ship) => <NavyHolder key={ship.shipID} shipState={ship} />)
            }
            <RightSpacer />
          </NavyGrid>
        </div>
      </DNDContext>
    </PlacementGridContext.Provider>
  );
};

export default PlacementGrid;
