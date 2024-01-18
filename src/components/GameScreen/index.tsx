import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import OpponentGrid from './OpponentGrid';
import Scoreboard from './Scoreboard';
import PlayerGrid from './PlayerGrid';
import useGameSocket from '../../hooks/useGameSocket';

const Container = styled.div`
  display: grid;
  grid-template-areas: 
    "opponent"
    "score"
    "player";
  grid-template-rows: 4fr 1fr 4fr;
  width: 90vw;
  height: 100%;
`;

const GameScreen = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.auth.loginResult?.username);
  const { roomID, wsAuthCode } = useAppSelector((state) => state.gameRoom);
  const gameRoomStatus = useAppSelector((state) => state.activeGame.gameRoomStatus);
  const socket = useGameSocket(username, roomID, wsAuthCode, dispatch);

  if (
    (username === gameRoomStatus.player1 && !gameRoomStatus.p1ShipsPlaced)
    || (username === gameRoomStatus.player2 && !gameRoomStatus.p2ShipsPlaced)
    || (username !== gameRoomStatus.player1 && username !== gameRoomStatus.player2)
  ) {
    return <Navigate to="/getReady" replace />;
  }

  return (
    <Container>
      <OpponentGrid />
      <Scoreboard />
      <PlayerGrid />
    </Container>
  );
};

export default GameScreen;
