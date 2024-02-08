import styled from 'styled-components';
import { GameStateValues } from '../../../store/gameRoomSlice/stateTypes';
import { assertNever } from '../../../utils/typeUtils';
import { Theme } from '../../assets/themes/themeDefault';
import Spinner from '../../Spinner';

const Container = styled.div<{ theme: Theme }>`
  grid-area: 1 / 1 / span 1 / span 2;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const Label = styled.p<{ theme: Theme }>`
  font-size: x-large;
  padding-inline: ${(props) => props.theme.paddingMin};
  text-align: center;

  @media (max-width: 35em) {
    font-size: small;
  }
`;

interface Props {
  gameState: GameStateValues;
}

const StatusMessage = ({ gameState }: Props) => {
  let message = '';
  let showSpinner = false;

  switch (gameState) {
    case GameStateValues.PlayerNotReady:
    case GameStateValues.InProgress:
    case GameStateValues.Finished:
      message = '';
      break;
    case GameStateValues.WaitingForOpponentToConnect:
      message = 'Waiting for an opponent to connect';
      showSpinner = true;
      break;
    case GameStateValues.WaitingForOpponentToGetReady:
      message = 'Opponent connected, waiting for opponent to get ready';
      showSpinner = true;
      break;
    case GameStateValues.OpponentReady:
      message = 'Opponent ready, game starting...';
      break;
    case GameStateValues.OpponentDisconnected:
      message = 'Opponent disconnected...';
      break;
    default: assertNever(gameState);
  }

  return (
    <Container>
      <Label>
        {message}
      </Label>
      <Spinner $visible={showSpinner} />
    </Container>
  );
};

export default StatusMessage;
