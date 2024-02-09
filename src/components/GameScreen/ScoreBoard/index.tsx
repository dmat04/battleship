import styled from 'styled-components';
import { useAppSelector } from '../../../store/store';
import PlayerScorecard from './PlayerScorecard';
import { Theme } from '../../assets/themes/themeDefault';
import { GameIsInProgress } from '../../../store/gameRoomSlice/stateTypes';
import StatusMessage from './StatusMessage';

const Container = styled.div<{ theme: Theme }>`
  grid-area: score;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-column-gap: ${(props) => props.theme.paddingSm};
`;

export type Owner = 'player' | 'opponent';

const Scoreboard = () => {
  const gameRoom = useAppSelector((state) => state.gameRoom);

  if (!GameIsInProgress(gameRoom)) {
    return (
      <Container>
        <StatusMessage />
      </Container>
    );
  }

  return (
    <Container>
      <PlayerScorecard owner="player" username={gameRoom.playerName} />
      <PlayerScorecard owner="opponent" username={gameRoom.opponentName} />
    </Container>
  );
};

export default Scoreboard;
