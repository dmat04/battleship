import styled from 'styled-components';
import { useAppSelector } from '../../../store/store';
import { GameState } from '../../../store/activeGameSlice/stateTypes';
import StatusMessage from './StatusMessage';
import PlayerScorecard from './PlayerScorecard';
import { Theme } from '../../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
  grid-area: score;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-column-gap: ${(props) => props.theme.paddingSm};
`;

export type Owner = 'player' | 'opponent';

const Scoreboard = () => {
  const {
    gameState,
    gameSettings,
    playerName,
    opponentName,
  } = useAppSelector((state) => state.activeGame);

  if (!gameSettings || !opponentName) return null;

  if (gameState !== GameState.InProgress) {
    return (
      <Container>
        <StatusMessage gameState={gameState} />
      </Container>
    );
  }

  return (
    <Container>
      <PlayerScorecard owner="player" username={playerName} />
      <PlayerScorecard owner="opponent" username="opponent" />
    </Container>
  );
};

export default Scoreboard;
