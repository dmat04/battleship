import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { GameState } from '../../store/activeGameSlice/stateTypes';
import OpponentGrid from './OpponentGrid';
import PlayerGrid from './PlayerGrid';
import Scoreboard from './Scoreboard';

const Container = styled.div`
  display: grid;
  grid-template-areas: 
    "score score"
    "player opponent";
  grid-template-rows: 1.5fr 5fr;
  width: 90vw;
  height: 100%;
`;

const GameScreen = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.activeGame.gameState);
  const pendingMessage = useAppSelector((state) => state.activeGame.pendingMoveResult);

  if (gameState === GameState.PlayerNotReady) {
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
