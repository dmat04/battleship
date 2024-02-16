import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Theme } from '../assets/themes/themeDefault';
import Notification from './Notification';
import { NotificationType } from '../../store/notificationSlice/stateTypes';
import { PushPermanentNotification, PushTransientNotification } from '../../store/notificationSlice';

const Container = styled.div<{ theme: Theme }>`
  position: fixed;
  bottom: ${(props) => props.theme.paddingLg};
  left: 0;
  right: 0;
  width: min(95vw, 50rem);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.paddingMin};
  z-index: 500;
`;

const NotificationOverlay = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.notifications);

  const notificationPusher = (type: NotificationType, timeout: number | undefined) => () => {
    const message = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea consectetur non inventore';

    if (timeout) {
      dispatch(PushTransientNotification({ message, type, timeoutArg: timeout }));
    } else {
      dispatch(PushPermanentNotification({ message, type }));
    }
  };

  return (
    <Container>
      {
        notifications.map((n) => (<Notification key={n.id} notification={n} />))
      }
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
        <button type="button" onClick={notificationPusher(NotificationType.Info, undefined)}>Push info</button>
        <button type="button" onClick={notificationPusher(NotificationType.Warning, 5000)}>Push warning</button>
        <button type="button" onClick={notificationPusher(NotificationType.Error, 5000)}>Push error</button>
      </div>
    </Container>
  );
};

export default NotificationOverlay;
