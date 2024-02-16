import { animated, useSpring } from '@react-spring/web';
import styled from 'styled-components';
import { Notification as NotificationData, NotificationType } from '../../store/notificationSlice/stateTypes';
import { Theme } from '../assets/themes/themeDefault';
import { assertNever } from '../../utils/typeUtils';
import CloseIcon from '../assets/icons/ic_close.svg';
import { useAppDispatch } from '../../store/store';
import { removeNotification } from '../../store/notificationSlice';

interface ContainerProps {
  theme: Theme;
  $type: NotificationType;
}

const Container = styled(animated.div) <ContainerProps>`
  background-color: #8bd2d6;
  background-color: ${(props) => {
    switch (props.$type) {
      case NotificationType.Info: return '#8bd2d6';
      case NotificationType.Warning: return '#ced68b';
      case NotificationType.Error: return '#d69d8b';
      default: return assertNever(props.$type);
    }
  }};
  border: 2px solid black;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  display: grid;
  grid-template-areas: 
    "life life"
    "message button";
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
`;

const Life = styled(animated.div)`
  grid-area: life;
  width: 100%;
  height: 0.25rem;
  background-color: green;
`;

const Message = styled.p<{ theme: Theme }>`
  grid-area: message;
  margin: ${(props) => props.theme.paddingMin}
`;

const DismissButton = styled.button`
  grid-area: button;
  width: 2rem;
  aspect-ratio: 1;
  background: ${`url(${CloseIcon})`};
  background-position: center;
  background-repeat: no-repeat;
  margin: ${(props) => props.theme.paddingMin}
`;

interface Props {
  notification: NotificationData
}

const Notification = ({ notification }: Props) => {
  const {
    id,
    type,
    message,
    expiresAt,
  } = notification;

  const now = Date.now();
  const dispatch = useAppDispatch();

  const dismiss = () => {
    dispatch(removeNotification(id));
  };

  const lifeSpring = useSpring({
    from: { width: '100%' },
    to: { width: '0%' },
    config: { duration: (expiresAt ?? now) - now },
  });

  return (
    <Container $type={type}>
      {
        expiresAt
        && <Life style={lifeSpring} />
      }
      <Message>{message}</Message>
      <DismissButton onClick={dismiss} />
    </Container>
  );
};

export default Notification;
