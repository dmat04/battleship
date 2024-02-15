import styled from 'styled-components';
import { useAppSelector } from '../../../../store/store';
import { Theme } from '../../../assets/themes/themeDefault';
import PlayerScorecard from './PlayerScorecard';

const Container = styled.div<{ theme: Theme }>`
  grid-area: score;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-column-gap: ${(props) => props.theme.paddingSm};
`;

export type Owner = 'player' | 'opponent';

const Scoreboard = () => {
  const gameRoom = useAppSelector((state) => state.gameRoom);

  if (!gameRoom.gameStarted) return null;

  return (
    <Container>
      <PlayerScorecard owner="player" username={gameRoom.playerName ?? ''} />
      <PlayerScorecard owner="opponent" username={gameRoom.opponentName ?? ''} />
    </Container>
  );
};

export default Scoreboard;
