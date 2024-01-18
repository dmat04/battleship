import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/store';
import PlacementGrid from './PlacementGrid';
import { Button } from '../Button';
import { Theme } from '../assets/themes/themeDefault';
import { submitPlacement } from '../../store/shipPlacementSlice';

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
  const username = useAppSelector((state) => state.auth.loginResult?.username);
  const roomID = useAppSelector((state) => state.gameRoom.roomID);
  const gameRoomStatus = useAppSelector((state) => state.activeGame.gameRoomStatus);
  const shipPlacementState = useAppSelector((state) => state.shipPlacement);
  const nonPlacedCount = useAppSelector((state) => state.shipPlacement.nonPlacedIDs.length);

  if (!roomID) return <Navigate to="/start" replace />;

  if (
    (username === gameRoomStatus.player1 && gameRoomStatus.p1ShipsPlaced)
    || (username === gameRoomStatus.player2 && gameRoomStatus.p2ShipsPlaced)
  ) {
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
