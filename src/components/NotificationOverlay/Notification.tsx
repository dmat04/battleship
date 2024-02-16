import { animated } from '@react-spring/web';
import styled from 'styled-components';
import { Notification as NotificationData, NotificationType } from '../../store/notificationSlice/stateTypes';
import { Theme } from '../assets/themes/themeDefault';
import { assertNever } from '../../utils/typeUtils';

interface ContainerProps {
  theme: Theme;
  $type: NotificationType;
}

const Container = styled(animated.div) <ContainerProps>`
  padding: ${(props) => props.theme.paddingMin};
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
`;

interface Props {
  notification: NotificationData
}

const Notification = ({ notification }: Props) => {
  const { type, message } = notification;

  return (
    <Container $type={type}>
      {type}
      -
      {message}
    </Container>
  );
};

export default Notification;
