import { animated, useSpring } from "@react-spring/web";
import { styled } from "styled-components";
import { forwardRef } from "react";
import {
  Notification as NotificationData,
  NotificationType,
} from "../../store/notificationSlice/stateTypes.js";
import { Theme } from "../assets/themes/themeDefault.js";
import { assertNever } from "@battleship/common/utils/typeUtils.js";
import CloseIcon from "../assets/icons/ic_close.svg";
import { useAppDispatch } from "../../store/store.js";
import { dismissNotification } from "../../store/notificationSlice/index.js";

interface ContainerProps {
  theme: Theme;
  $type: NotificationType;
}

const ColoredBase = styled(animated.div)<ContainerProps>`
  background-color: ${(props) => {
    switch (props.$type) {
      case NotificationType.Info:
        return props.theme.colors.containerSuccess;
      case NotificationType.Warning:
        return props.theme.colors.containerWarning;
      case NotificationType.Error:
        return props.theme.colors.containerDanger;
      default:
        return assertNever(props.$type);
    }
  }};

  color: ${(props) => {
    switch (props.$type) {
      case NotificationType.Info:
        return props.theme.colors.onContainerSuccess;
      case NotificationType.Warning:
        return props.theme.colors.onContainerWarning;
      case NotificationType.Error:
        return props.theme.colors.onContainerDanger;
      default:
        return assertNever(props.$type);
    }
  }};
`;

const Container = styled(ColoredBase)<{ theme: Theme }>`
  border: ${(props) => props.theme.borderStyle};
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  display: grid;
  grid-template-areas:
    "life life"
    "message button";
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
`;

const Life = styled(ColoredBase)`
  grid-area: life;
  width: 100%;
  height: 0.25rem;

  filter: invert(20%) saturate(2000%);
`;

const Message = styled.p<{ theme: Theme }>`
  grid-area: message;
  margin: ${(props) => props.theme.paddingMin};
`;

const DismissButton = styled.button`
  grid-area: button;
  width: 2rem;
  aspect-ratio: 1;
  display: flex;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  margin: ${(props) => props.theme.paddingMin};
  color: currentColor;
`;

interface Props {
  notification: NotificationData;
}

const Notification = forwardRef<HTMLDivElement, Props>(
  ({ notification }: Props, ref) => {
    const { id, type, message, transientInfo } = notification;

    const dispatch = useAppDispatch();

    const dismiss = () => {
      dispatch(dismissNotification(id));
    };

    const lifeSpring = useSpring({
      from: { width: "100%" },
      to: { width: "0%" },
      config: { duration: transientInfo?.duration ?? 0 },
    });

    return (
      <Container $type={type} ref={ref}>
        {transientInfo && <Life $type={type} style={lifeSpring} />}
        <Message>{message}</Message>
        <DismissButton onClick={dismiss}>
          <CloseIcon />
        </DismissButton>
      </Container>
    );
  },
);

export default Notification;
