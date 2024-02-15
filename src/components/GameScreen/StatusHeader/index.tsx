import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { PlayerStatus } from '../../../store/gameRoomSlice/stateTypes';
import { useAppSelector } from '../../../store/store';
import OpponentStatus from './OpponentStatus';
import InviteCode from './InviteCode';
import { Theme } from '../../assets/themes/themeDefault';
import CollapsibleContainer, { CollapsibleAPI } from '../../CollapsibleContainer';

const Container = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const StatusHeader = () => {
  const {
    inviteCode,
    opponentStatus,
    gameStarted,
    gameResult,
  } = useAppSelector((state) => state.gameRoom);
  const inviteCodeCollapsible = useRef<CollapsibleAPI>(null);
  const opponentStatusCollapsible = useRef<CollapsibleAPI>(null);

  useEffect(() => {
    if (gameResult || gameStarted) {
      inviteCodeCollapsible.current?.setState('closed');
      opponentStatusCollapsible.current?.setState('closed');
      return;
    }

    if (inviteCode && opponentStatus === PlayerStatus.Disconnected) {
      inviteCodeCollapsible.current?.setState('open');
    } else {
      inviteCodeCollapsible.current?.setState('closed');
    }
  }, [inviteCode, opponentStatus, gameResult, gameStarted]);

  return (
    <Container>
      <CollapsibleContainer
        initialState={inviteCode ? 'open' : 'closed'}
        ref={inviteCodeCollapsible}
      >
        <InviteCode />
      </CollapsibleContainer>
      <CollapsibleContainer
        initialState="open"
        ref={opponentStatusCollapsible}
      >
        <OpponentStatus />
      </CollapsibleContainer>
    </Container>
  );
};

export default StatusHeader;
