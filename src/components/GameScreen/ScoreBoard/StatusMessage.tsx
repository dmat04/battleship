import styled from 'styled-components';
import { assertNever } from '../../../utils/typeUtils';
import { Theme } from '../../assets/themes/themeDefault';
import Spinner from '../../Spinner';
import { useAppSelector } from '../../../store/store';
import { PlayerStatus } from '../../../store/gameRoomSlice/stateTypes';
import InviteCodeInfo from '../../InviteCodeInfo';

const Container = styled.div<{ theme: Theme }>`
  grid-area: 1 / 1 / span 1 / span 2;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const Label = styled.p<{ theme: Theme }>`
  padding-inline: ${(props) => props.theme.paddingMin};
  text-align: center;
`;

const StatusMessage = () => {
  const { opponentStatus } = useAppSelector((state) => state.gameRoom);

  let message = '';

  switch (opponentStatus) {
    case PlayerStatus.Disconnected:
      message = 'Waiting for an opponent to connect';
      break;
    case PlayerStatus.Connected:
      message = 'Opponent connected, waiting for opponent to get ready';
      break;
    case PlayerStatus.Ready:
      message = 'Opponent ready, game starting...';
      break;
    default: assertNever(opponentStatus);
  }

  return (
    <Container>
      <InviteCodeInfo />
      <Label>
        {message}
      </Label>
      <Spinner $visible />
    </Container>
  );
};

export default StatusMessage;
