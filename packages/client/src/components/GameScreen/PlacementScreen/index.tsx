import { Navigate } from "react-router-dom";
import { styled } from "styled-components";
import PlacementGrid from "./PlacementGrid/index.js";
import { submitPlacement } from "../../../store/shipPlacementSlice/thunks.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import Button from "../../Button.js";
import { Theme } from "../../assets/themes/themeDefault.js";

const Container = styled.div<{ theme: Theme }>`
  width: min(90vw, 30rem);
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.paddingSm};
`;

const Header = styled.div<{ theme: Theme }>`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: ${(props) => props.theme.paddingSm};
`;

const PlacementScreen = () => {
  const dispatch = useAppDispatch();
  const { roomID, playerShips } = useAppSelector((state) => state.gameRoom);
  const shipPlacementState = useAppSelector((state) => state.shipPlacement);
  const nonPlacedCount = useAppSelector(
    (state) => state.shipPlacement.nonPlacedIDs.length,
  );

  if (!roomID) return <Navigate to="/menu" replace />;

  if (playerShips) {
    return <Navigate to="/game/play" replace />;
  }

  if (shipPlacementState.shipStates.length === 0) return null;

  const handleSubmit = () => {
    void dispatch(submitPlacement(roomID));
  };

  return (
    <Container>
      <Header>
        <p>Place your ships</p>
        <Button
          variant="primary"
          disabled={nonPlacedCount > 0}
          onClick={handleSubmit}
        >
          Start
        </Button>
      </Header>
      <PlacementGrid />
    </Container>
  );
};

export default PlacementScreen;
