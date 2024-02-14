import { useTransition } from '@react-spring/web';
import styled from 'styled-components';
import { PlayerStatus } from '../../../store/gameRoomSlice/stateTypes';
import { useAppSelector } from '../../../store/store';
import OpponentStatus from './OpponentStatus';
import InviteCode from './InviteCode';
import { assertNever } from '../../../utils/typeUtils';
import { Theme } from '../../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

type StatusItem = 'inviteCode' | 'opponentStatus';

const StatusHeader = () => {
  const { inviteCode, opponentStatus } = useAppSelector((state) => state.gameRoom);

  const items: StatusItem[] = [];

  if (inviteCode && opponentStatus === PlayerStatus.Disconnected) {
    items.push('inviteCode');
  }

  if (opponentStatus !== PlayerStatus.Ready) {
    items.push('opponentStatus');
  }

  const itemTranistion = useTransition<StatusItem, any>(
    items,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    },
  );

  return (
    <Container>
      {
        itemTranistion((style, item) => {
          switch (item) {
            case 'inviteCode': return <InviteCode style={style} />;
            case 'opponentStatus': return <OpponentStatus style={style} />;
            default: return assertNever(item);
          }
        })
      }
    </Container>
  );
};

export default StatusHeader;
