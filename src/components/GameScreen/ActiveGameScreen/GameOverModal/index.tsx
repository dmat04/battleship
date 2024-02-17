import styled, { keyframes } from 'styled-components';
import { clearRoom, rematch } from '../../../../store/gameRoomSlice';
import { GameResult } from '../../../../store/gameRoomSlice/stateTypes';
import { useAppSelector, useAppDispatch } from '../../../../store/store';
import { closeWSConnection, sendMessage } from '../../../../store/wsMiddleware/actions';
import { RoomStatusRequestMessage, ClientMessageCode } from '../../../../store/wsMiddleware/messageTypes';
import { assertNever } from '../../../../utils/typeUtils';
import { Button } from '../../../Button';
import { Theme } from '../../../assets/themes/themeDefault';

const Blur = keyframes`
  from {
    backdrop-filter: blur(0);
  }

  to {
    backdrop-filter: blur(0.2rem);
  }
`;

const FadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: hsl(0 0% 100% / 0.1);
  backdrop-filter: blur(0);
  animation: ${Blur} 500ms linear forwards;
  z-index: 999;
`;

const Card = styled.div<{ theme: Theme }>`
  display: grid;
  grid-template-areas:
    "header"
    "body"
    "footer";
  width: fit-content;
  border: 2px solid black;
  margin: ${(props) => props.theme.paddingSm};
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  opacity: 0;
  animation: ${FadeIn} 100ms 400ms linear forwards;
`;

const CardHeader = styled.div<{ theme: Theme }>`
  grid-area: header;
  padding: ${(props) => props.theme.paddingSm};
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
`;

const CardBody = styled.div<{ theme: Theme }>`
  grid-area: body;
  padding: ${(props) => props.theme.paddingSm};
  text-align: center;
  font-weight: 800;
  white-space: pre-line;
`;

const CardFooter = styled.div<{ theme: Theme }>`
  grid-area: footer;
  display: flex;
  padding: ${(props) => props.theme.paddingSm};
  gap: ${(props) => props.theme.paddingSm};
`;

const GameOverModal = () => {
  const { gameResult, opponentName } = useAppSelector((state) => state.gameRoom);
  const dispatch = useAppDispatch();
  let message = '';

  if (!gameResult || !opponentName) return null;

  switch (gameResult) {
    case GameResult.PlayerWon:
      message = 'Congratulations, you won!';
      break;
    case GameResult.OpponentWon:
      message = `${opponentName} has won.\nBetter luck next time.`;
      break;
    case GameResult.OpponentDisconnected:
      message = `${opponentName} has quit, you win!`;
      break;
    default:
      assertNever(gameResult);
      break;
  }

  const handleExit = () => {
    dispatch(clearRoom());
    dispatch(closeWSConnection());
  };

  const handleRematch = () => {
    dispatch(rematch());

    const statusRequest: RoomStatusRequestMessage = {
      code: ClientMessageCode.RoomStatusRequest,
    };

    dispatch(sendMessage(statusRequest));
  };

  return (
    <Container>
      <Card>
        <CardHeader>Game Over</CardHeader>
        <CardBody>{message}</CardBody>
        <CardFooter>
          {
            gameResult !== GameResult.OpponentDisconnected
            && <Button $variant="primary" onClick={handleRematch}>Rematch</Button>
          }
          <Button $variant="warning" onClick={handleExit}>Exit</Button>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default GameOverModal;
