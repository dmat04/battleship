import styled from 'styled-components';
import { useMemo } from 'react';
import { animated, useTransition } from '@react-spring/web';
import { useAppSelector } from '../../../store/store';
import { Theme } from '../../assets/themes/themeDefault';
import { type Ship, PlacedShip } from '../../../__generated__/graphql';

const PlayerScoreContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1em;
`;

const ShipIndicator = styled(animated.div) <{ $ship: ShipScoreItem, theme: Theme }>`
  width: 1em;
  height: ${(props) => `${props.$ship.size}em`};
`;

const mapScoreItems = (
  availableShips: Ship[],
  sunkenShips: PlacedShip[],
  owner: Props['owner'],
) => {
  const score: ShipScoreItem[] = availableShips
    .map((ship) => ({ ...ship, sunken: false }))
    .sort((a, b) => {
      let res = a.size - b.size;
      if (owner !== 'player') res = -res;
      return res;
    });

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
  owner: 'player' | 'opponent';
}

const PlayerScorecard = ({ owner }: Props) => {
  const activeGame = useAppSelector((state) => state.activeGame);

  const { gameSettings } = activeGame;
  const gridState = owner === 'player'
    ? activeGame.playerGridState
    : activeGame.opponentGridState;

  const scoreItems: ShipScoreItem[] = useMemo(() => {
    if (gameSettings?.availableShips) {
      return mapScoreItems(gameSettings.availableShips, gridState.sunkenShips, owner);
    }

    return [];
  }, [gameSettings?.availableShips, gridState.sunkenShips, owner]);

  const animatedScoreItems = useTransition<ShipScoreItem, any>(
    scoreItems,
    {
      keys: (item: ShipScoreItem) => `${item.shipID}-${item.sunken ? 'dead' : 'alive'}`,
      from: { background: 'green' },
      enter: (item: ShipScoreItem) => ({ background: item.sunken ? 'red' : 'green' }),
    },
  );

  if (!gameSettings) return null;

  return (
    <PlayerScoreContainer>
      {
        animatedScoreItems(
          (style, item) => <ShipIndicator style={style} $ship={item} />,
        )
      }
    </PlayerScoreContainer>
  );
};

export default PlayerScorecard;
