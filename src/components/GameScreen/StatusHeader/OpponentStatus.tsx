import styled from 'styled-components';
import { SpringValues, animated } from '@react-spring/web';
import { PlayerStatus } from '../../../store/gameRoomSlice/stateTypes';
import { useAppSelector } from '../../../store/store';
import { assertNever } from '../../../utils/typeUtils';
import Spinner from '../../Spinner';
import { Theme } from '../../assets/themes/themeDefault';

const Container = styled(animated.div)<{ theme: Theme }>`
  grid-area: 1 / 1 / span 1 / span 2;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  gap: ${(props) => props.theme.paddingMin};
`;

const Label = styled.p<{ theme: Theme }>`
  padding-inline: ${(props) => props.theme.paddingMin};
  text-align: center;
`;

const OpponentStatus = ({ style }: { style: SpringValues }) => {
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
    <Container style={style}>
      <Label>
        {message}
      </Label>
      <Spinner $visible />
    </Container>
  );
};

export default OpponentStatus;
