import { useMemo } from 'react';
import styled from 'styled-components';
import createSocket from './wsBehaviour';
import { useAppDispatch } from '../../store/store';
import OpponentGrid from './OpponentGrid';
import Scoreboard from './Scoreboard';
import PlayerGrid from './PlayerGrid';

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

  const socket = useMemo(() => createSocket('wss://example.com', 'authCode', dispatch), [dispatch]);

  return (
    <Container>
      <OpponentGrid />
      <Scoreboard />
      <PlayerGrid />
    </Container>
  );
};

export default GameScreen;
