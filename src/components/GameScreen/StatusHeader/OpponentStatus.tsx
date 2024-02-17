import styled from 'styled-components';
import { PlayerStatus } from '../../../store/gameRoomSlice/stateTypes';
import { useAppSelector } from '../../../store/store';
import { assertNever } from '../../../utils/typeUtils';
import Spinner from '../../Spinner';
import { Theme } from '../../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const Label = styled.p<{ theme: Theme }>`
  text-align: center;
`;

const OpponentStatus = () => {
  const { opponentStatus, opponentName } = useAppSelector((state) => state.gameRoom);

  let message = '';
  let success = false;

  switch (opponentStatus) {
    case PlayerStatus.Disconnected:
      message = 'Waiting for an opponent to connect';
      break;
    case PlayerStatus.Connected:
      message = `${opponentName ?? 'Opponent'} connected, waiting for them to get ready`;
      break;
    case PlayerStatus.Ready:
      message = `${opponentName ?? 'Opponent'} ready`;
      success = true;
      break;
    default: assertNever(opponentStatus);
  }

  return (
    <Container>
      <Label>
        {message}
      </Label>
      <Spinner $visible $success={success} />
    </Container>
  );
};

export default OpponentStatus;
