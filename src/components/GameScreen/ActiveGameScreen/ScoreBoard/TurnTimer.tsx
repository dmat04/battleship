import styled from 'styled-components';
import { useEffect } from 'react';
import { animated, useSpring } from '@react-spring/web';
import type { Owner } from '.';
import { useAppSelector } from '../../../../store/store';

const Container = styled(animated.div) <{ $owner: Owner }>`
  position: relative;
  grid-area: timer;
  height: 100%;
  width: 100%;
  background-color: ${(props) => (props.$owner === 'player' ? 'green' : 'red')};
`;

interface Props {
  owner: Owner;
}

const TurnTimer = ({ owner }: Props) => {
  const { gameSettings, round, gameResult } = useAppSelector((state) => state.gameRoom);

  const [timerSpring, timerSpringApi] = useSpring(
    () => ({
      from: { width: '100%' },
      to: { width: '0%' },
      config: {
        duration: (gameSettings?.turnDuration ?? 0) * 1000,
      },
    }),
  );

  useEffect(() => {
    timerSpringApi.start({
      from: { width: '100%' },
      to: { width: '0%' },
      config: {
        duration: (gameSettings?.turnDuration ?? 0) * 1000,
      },
    });
  }, [round, gameSettings?.turnDuration, timerSpringApi]);

  useEffect(() => {
    if (gameResult) {
      timerSpringApi.pause();
    }
  }, [gameResult, timerSpringApi]);

  return <Container $owner={owner} style={timerSpring} />;
};

export default TurnTimer;
