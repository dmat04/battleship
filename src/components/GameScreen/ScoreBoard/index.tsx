import styled from 'styled-components';
import { useMemo } from 'react';
import { useAppSelector } from '../../../store/store';
import { GameState } from '../../../store/activeGameSlice/stateTypes';
import StatusMessage from './StatusMessage';
import { Theme } from '../../assets/themes/themeDefault';
import { Ship } from '../../../__generated__/graphql';

const Container = styled.div`
  grid-area: score;
  display: flex;
  gap: 1em;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PlayerScoreContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1em;
`;

const ShipIndicator = styled.div<{ $ship: ShipScoreItem, theme: Theme }>`
  background-color: ${(props) => (props.$ship.sunken ? 'red' : 'green')};
  width: 1em;
  height: ${(props) => `${props.$ship.size}em`};
`;

type ShipScoreItem = Ship & { sunken: boolean };

const Scoreboard = () => {
  const {
    gameState,
    gameSettings,
    playerGridState,
    opponentGridState,
  } = useAppSelector((state) => state.activeGame);

  const playerScore: ShipScoreItem[] = useMemo(() => {
    const score: ShipScoreItem[] = gameSettings?.availableShips.map(
      (ship) => ({
        ...ship,
        sunken: false,
      }),
    ) ?? [];

    playerGridState.sunkenShips.forEach((sunken) => {
      const idx = score.findIndex((item) => item.shipID === sunken.ship.shipID);
      if (idx >= 0) {
        score[idx].sunken = true;
      }
    });

    return score;
  }, [gameSettings?.availableShips, playerGridState.sunkenShips]);

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
      <PlayerScoreContainer>
        {playerScore.map((ship) => <ShipIndicator key={ship.shipID} $ship={ship} />)}
      </PlayerScoreContainer>
      <PlayerScoreContainer>
        {playerScore.reverse().map((ship) => <ShipIndicator key={ship.shipID} $ship={ship} />)}
      </PlayerScoreContainer>
    </Container>
  );
};

export default Scoreboard;
