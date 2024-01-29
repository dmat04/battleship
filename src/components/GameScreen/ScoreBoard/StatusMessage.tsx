import styled from 'styled-components';
import { GameState } from '../../../store/activeGameSlice/stateTypes';
import { assertNever } from '../../../utils/typeUtils';
import { Theme } from '../../assets/themes/themeDefault';
import Spinner from '../../Spinner';

const Container = styled.div<{ theme: Theme }>`
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
  gameState: GameState;
}

const StatusMessage = ({ gameState }: Props) => {
  let message = '';
  let showSpinner = false;

  switch (gameState) {
    case GameState.PlayerNotReady:
    case GameState.InProgress:
    case GameState.Finished:
      message = '';
      break;
    case GameState.WaitingForOpponentToConnect:
      message = 'Waiting for an opponent to connect';
      showSpinner = true;
      break;
    case GameState.WaitingForOpponentToGetReady:
      message = 'Opponent connected, waiting for opponent to get ready';
      showSpinner = true;
      break;
    case GameState.OpponentReady:
      message = 'Opponent ready, game starting...';
      break;
    case GameState.OpponentDisconnected:
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
