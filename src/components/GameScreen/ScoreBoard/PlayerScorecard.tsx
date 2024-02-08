import styled from 'styled-components';
import { useMemo } from 'react';
import { animated, useTransition } from '@react-spring/web';
import { useAppSelector } from '../../../store/store';
import { Theme } from '../../assets/themes/themeDefault';
import { type Ship, PlacedShip } from '../../../__generated__/graphql';
import type { Owner } from '.';
import { GameRoomIsReady, ScoreState } from '../../../store/gameRoomSlice/stateTypes';
import TurnTimer from './TurnTimer';

const Container = styled.div<{ $owner: Owner }>`
  position: relative;
  display: grid;
  grid-template-areas:
    "timer"
    "name"
    "score";
  gap: 1em;
  grid-template-rows: 0.5rem 0.5fr 1fr;
  justify-items: ${(props) => (props.$owner === 'player' ? 'end' : 'start')};

  @media (max-width: 60em) {
    gap: 0.5em;
  }
`;

const PlayerName = styled.p<{ $owner: Owner }>`
  grid-area: name;
  font-size: x-large;
  word-wrap: break-word;
  word-break: break-all;
  text-overflow: ellipsis;

  @media (max-width: 60em) {
    font-size: medium;
  }
`;

const PlayerScoreContainer = styled.div<{ $owner: Owner }>`
  grid-area: score;
  display: flex;
  flex-direction: ${(props) => (props.$owner === 'player' ? 'row' : 'row-reverse')};
  gap: 0.33em;

  @media (max-width: 60em) {
    gap: 0.2em;
  }
`;

const ShipIndicator = styled(animated.div) <{ $ship: ShipScoreItem, theme: Theme }>`
  width: 1em;
  height: ${(props) => `${props.$ship.size}em`};

  @media (max-width: 60em) {
    width: 0.5em;
    height: ${(props) => `${props.$ship.size / 2}em`};
  }
`;

const mapScoreItems = (
  availableShips: Ship[],
  sunkenShips: PlacedShip[],
) => {
  const score: ShipScoreItem[] = availableShips
    .map((ship) => ({ ...ship, sunken: false }))
    .sort((a, b) => a.size - b.size);

  sunkenShips.forEach((sunken) => {
    const idx = score.findIndex((item) => item.shipID === sunken.ship.shipID);
    if (idx >= 0) {
      score[idx].sunken = true;
    }
  });

  return score;
};

export type ShipScoreItem = Ship & { sunken: boolean };

export interface Props {
  owner: Owner;
  username: string;
}

const PlayerScorecard = ({ owner, username }: Props) => {
  const gameRoom = useAppSelector((state) => state.gameRoom);

  let score: ScoreState = {
    hitCells: [],
    missedCells: [],
    inaccessibleCells: [],
    sunkenShips: [],
  };

  if (GameRoomIsReady(gameRoom)) {
    score = owner === 'player'
      ? gameRoom.playerScore
      : gameRoom.opponentScore;
  }

  const { gameSettings, currentPlayer } = gameRoom;
  const ownerName = owner === 'player'
    ? gameRoom.playerName
    : gameRoom.opponentName;

  const scoreItems: ShipScoreItem[] = useMemo(() => {
    if (gameSettings?.availableShips) {
      return mapScoreItems(gameSettings.availableShips, score.sunkenShips);
    }

    return [];
  }, [gameSettings?.availableShips, score.sunkenShips]);

  const animatedScoreItems = useTransition<ShipScoreItem, any>(
    scoreItems,
    {
      keys: (item: ShipScoreItem) => `${item.shipID}-${item.sunken ? 'dead' : 'alive'}`,
      from: { background: 'green' },
      enter: (item: ShipScoreItem) => ({ background: item.sunken ? 'red' : 'green' }),
    },
  );

  if (!gameSettings) return null;

  const active = currentPlayer === ownerName;

  return (
    <Container $owner={owner}>
      {
        active && <TurnTimer owner={owner} />
      }

      <PlayerName $owner={owner}>
        {username}
      </PlayerName>

      <PlayerScoreContainer $owner={owner}>
        {
          animatedScoreItems(
            (style, item) => <ShipIndicator style={style} $ship={item} />,
          )
        }
      </PlayerScoreContainer>
    </Container>
  );
};

export default PlayerScorecard;
