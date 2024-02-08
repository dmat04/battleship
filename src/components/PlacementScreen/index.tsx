import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/store';
import PlacementGrid from './PlacementGrid';
import { Button } from '../Button';
import { Theme } from '../assets/themes/themeDefault';
import { GameStateValues } from '../../store/gameRoomSlice/stateTypes';
import { submitPlacement } from '../../store/shipPlacementSlice/thunks';

const Container = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.paddingSm};

  @media (max-width: 35em) {
    gap: ${(props) => props.theme.paddingMin};
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Info = styled.p`
  font-size: larger;
`;

const PlacementScreen = () => {
  const dispatch = useAppDispatch();
  const roomID = useAppSelector((state) => state.gameRoom.roomID);
  const gameState = useAppSelector((state) => state.gameRoom.gameState);
  const shipPlacementState = useAppSelector((state) => state.shipPlacement);
  const nonPlacedCount = useAppSelector((state) => state.shipPlacement.nonPlacedIDs.length);

  if (!roomID) return <Navigate to="/start" replace />;

  if (gameState !== GameStateValues.PlayerNotReady) {
    return <Navigate to="/game" replace />;
  }

  if (shipPlacementState.shipStates.length === 0) return null;

  const handleSubmit = () => {
    dispatch(submitPlacement(roomID));
  };

  return (
    <Container>
      <Header>
        <Info>Place your ships</Info>
        <Button
          $variant="primary"
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
