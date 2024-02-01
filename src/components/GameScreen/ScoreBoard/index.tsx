import styled from 'styled-components';
import { useAppSelector } from '../../../store/store';
import { GameState } from '../../../store/activeGameSlice/stateTypes';
import StatusMessage from './StatusMessage';
import PlayerScorecard from './PlayerScorecard';

const Container = styled.div`
  grid-area: score;
  display: flex;
  gap: 1em;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Scoreboard = () => {
  const { gameState, gameSettings } = useAppSelector((state) => state.activeGame);

  if (!gameSettings) return null;

  if (gameState !== GameState.InProgress) {
    return (
      <Container>
        <StatusMessage gameState={gameState} />
      </Container>
    );
  }

  return (
    <Container>
      <PlayerScorecard owner="player" />
      <PlayerScorecard owner="opponent" />
    </Container>
  );
};

export default Scoreboard;
