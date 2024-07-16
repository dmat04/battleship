import styled, { useTheme } from 'styled-components';
import { animated, useTransition } from '@react-spring/web';
import { useMemo } from 'react';
import { useAppSelector } from '../../store/store';
import { Theme } from '../assets/themes/themeDefault';
import NotificationComponent from './Notification';
import { Notification as NotificationData } from '../../store/notificationSlice/stateTypes';

const Container = styled.div<{ theme: Theme }>`
  position: fixed;
  bottom: ${(props) => props.theme.paddingLg};
  left: 0;
  right: 0;
  width: min(95vw, 50rem);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  z-index: 500;
`;

const NotificationAnimationContainer = styled(animated.div)`
  position: relative;
  overflow: hidden;
`;

const NotificationOverlay = () => {
  const theme = useTheme() as Theme;
  const notifications = useAppSelector((state) => state.notification.notifications);
  const notificationRefMap = useMemo(
    () => new WeakMap<NotificationData, HTMLDivElement>(),
    [],
  );

  const notificationTransitions = useTransition<NotificationData, any>(notifications, {
    keys: (item: NotificationData) => item.id,
    from: { opacity: 0, height: 0, marginBottom: '0rem' },
    enter: (item: NotificationData) => async (next: Function) => next({
      opacity: 1,
      height: notificationRefMap.get(item)?.offsetHeight ?? 0,
      marginBottom: theme.paddingMin,
    }),
    leave: { opacity: 0, height: 0, marginBottom: '0rem' },
  });

  return (
    <Container>
      {
        notificationTransitions((style, item) => (
          <NotificationAnimationContainer style={style}>
            <NotificationComponent
              ref={(ref: HTMLDivElement) => {
                if (ref) {
                  notificationRefMap.set(item, ref);
                }
              }}
              notification={item}
            />
          </NotificationAnimationContainer>
        ))
      }
    </Container>
  );
};

export default NotificationOverlay;
