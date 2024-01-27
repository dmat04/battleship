import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { GameState } from '../../store/activeGameSlice/stateTypes';
import Scoreboard from './Scoreboard';
import LiveGameGrid from './LiveGameGrid';

const Container = styled.div`
  display: grid;
  grid-template-areas: 
    "score score"
    "player opponent";
  grid-template-rows: 1.5fr 5fr;
  width: 60vw;
  height: 100%;

  @media (max-width: 60em) {
    grid-template-areas: 
      "player"
      "score"
      "opponent";
    grid-template-rows: 5fr 1fr 5fr;
    align-items: center;
    width: 80vw;
    height: 100%;
  }
`;

const GameScreen = () => {
  const gameState = useAppSelector((state) => state.activeGame.gameState);

  if (gameState === GameState.PlayerNotReady) {
    return <Navigate to="/getReady" replace />;
  }

  return (
    <Container>
      <LiveGameGrid owner="player" />
      <Scoreboard />
      <LiveGameGrid owner="opponent" />
    </Container>
  );
};

export default GameScreen;
