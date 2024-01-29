import styled from 'styled-components';
import { useAppSelector } from '../../../store/store';
import { GameState } from '../../../store/activeGameSlice/stateTypes';
import StatusMessage from './StatusMessage';

const Container = styled.div`
  grid-area: score;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Scoreboard = () => {
  const state = useAppSelector((state) => state.activeGame);

  return (
    <Container>
      <StatusMessage gameState={state.gameState} />
    </Container>
  );
};

export default Scoreboard;
