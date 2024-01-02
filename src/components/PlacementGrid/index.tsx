import styled from 'styled-components';
import { useMemo, useRef, useState } from 'react';
import GameGrid from '../GameGrid';
import DNDContext from './DNDContext';
import DraggableShip from './DraggableShip';
import { createDroppableCells } from './utils';
import PlacementGridContext, { IPlacementGridContext } from './PlacementGridContext';

const NavyGrid = styled.div`
  display: grid;
  background-color: palegreen;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(8, 1fr);
  grid-auto-flow: dense;
  aspect-ratio: 10 / 8;
`;

const RightSpacer = styled.div`
  background-color: aliceblue;
  grid-area: 1 / 10 / span 10 / span 1;
`;

const NavyHolderContainer = styled.div<{ $shipSize: number, $vertical: boolean, $color: string }>`
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
  background-color: ${(props) => props.$color};
  grid-row-end: ${(props) => (props.$vertical ? `span ${props.$shipSize + 1}` : 'span 2')};
  grid-column-end: ${(props) => (props.$vertical ? 'span 2' : `span ${props.$shipSize + 1}`)};
`;

interface NavyHolderProps {
  shipSize: number;
  color: string
}

const NavyHolder = ({ shipSize, color }: NavyHolderProps) => {
  const [vertical, setVertical] = useState<boolean>(false);

  return (
    <NavyHolderContainer $shipSize={shipSize} $vertical={vertical} $color={color}>
      <DraggableShip
        col={2}
        row={2}
        size={5}
        color={color}
        vertical={vertical}
        setVertical={setVertical}
      />
    </NavyHolderContainer>
  );
};

const cells = createDroppableCells(10, 10);

const PlacementGrid = () => {
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const contextValue: IPlacementGridContext = useMemo(() => ({ gridContainerRef }), []);

  return (
    <PlacementGridContext.Provider value={contextValue}>
      <DNDContext>
        <div ref={gridContainerRef}>
          <GameGrid>
            {cells}
          </GameGrid>
          <NavyGrid>
            <NavyHolder shipSize={5} color="red" />
            <NavyHolder shipSize={4} color="green" />
            <NavyHolder shipSize={3} color="blue" />
            <NavyHolder shipSize={2} color="yellow" />
            <NavyHolder shipSize={2} color="purple" />
            <NavyHolder shipSize={1} color="orange" />
            <NavyHolder shipSize={1} color="brown" />
            <RightSpacer />
          </NavyGrid>
        </div>
      </DNDContext>
    </PlacementGridContext.Provider>
  );
};

export default PlacementGrid;
