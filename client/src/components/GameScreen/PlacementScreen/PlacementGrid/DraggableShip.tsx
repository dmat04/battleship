import styled from "styled-components";
import { useRef } from "react";
import { ShipOrientation } from "../../../../__generated__/graphql";
import useShipDrag from "../../../../hooks/useShipDrag";
import Ship from "../../Ship";

const NavySpacerContainer = styled.div<{
  $shipSize: number;
  $vertical: boolean;
}>`
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
  grid-row-end: ${(props) =>
    props.$vertical ? `span ${props.$shipSize + 1}` : "span 2"};
  grid-column-end: ${(props) =>
    props.$vertical ? "span 2" : `span ${props.$shipSize + 1}`};
`;

interface PropTypes {
  id: string;
}

const DraggableShip = ({ id }: PropTypes) => {
  const shipContainerRef = useRef<HTMLDivElement>(null);
  const dragProps = useShipDrag({ id, shipContainerRef });

  if (dragProps === null) return null;

  const {
    ship,
    orientation,
    gridPosition,
    listeners,
    containerSpring,
    imageSpring,
  } = dragProps;

  const { x, y } = gridPosition ?? { x: -1, y: -1 };

  const shipComponent = (
    <Ship
      ref={shipContainerRef}
      listeners={listeners}
      containerStyle={containerSpring}
      imageStyle={imageSpring}
      col={x}
      row={y}
      orientation={orientation}
      size={ship.size}
    />
  );

  if (gridPosition !== null) {
    return shipComponent;
  }

  return (
    <NavySpacerContainer
      $shipSize={ship.size}
      $vertical={orientation === ShipOrientation.Vertical}
    >
      <div style={{ gridArea: "1 / 1 / 1 / -1" }} />
      <div style={{ gridArea: "2 / 1 / 2 / 1" }} />
      {shipComponent}
    </NavySpacerContainer>
  );
};

export default DraggableShip;
