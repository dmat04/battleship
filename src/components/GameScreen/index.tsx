import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { GameStateValues } from '../../store/gameRoomSlice/stateTypes';
import Scoreboard from './ScoreBoard';
import LiveGameGrid from './LiveGameGrid';
import { Theme } from '../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
  display: grid;
  grid-template-areas: 
    "score score"
    "player opponent";
  grid-template-rows: 1fr 5fr;
  grid-row-gap: ${(props) => props.theme.paddingSm};
  grid-column-gap: ${(props) => props.theme.paddingSm};
  width: 60vw;

  @media (max-width: 60em) {
    grid-template-areas: 
      ". player ."
      "score score score"
      "opponent opponent opponent";
    grid-template-rows: none;
    grid-template-columns: 1fr 4fr 1fr;
    grid-row-gap: ${(props) => props.theme.paddingMin};
    align-items: center;
    width: 95vw;
  }
`;

const GameScreen = () => {
  const gameState = useAppSelector((state) => state.gameRoom.gameState);

  if (gameState === GameStateValues.PlayerNotReady) {
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
