import { styled } from "styled-components";
import { useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import type { Owner } from "./index.js";
import { useAppSelector } from "../../../../store/store.js";
import { Theme } from "../../../assets/themes/themeDefault.js";

const Container = styled(animated.div)<{ $owner: Owner; theme: Theme }>`
  position: relative;
  grid-area: timer;
  height: 100%;
  width: 100%;
  background-color: ${(props) =>
    props.$owner === "player"
      ? props.theme.colors.scoreGreen
      : props.theme.colors.scoreRed};
`;

interface Props {
  owner: Owner;
}

const TurnTimer = ({ owner }: Props) => {
  const { gameSettings, round, gameResult } = useAppSelector(
    (state) => state.gameRoom,
  );

  const [timerSpring, timerSpringApi] = useSpring(() => ({
    from: { width: "100%" },
    to: { width: "0%" },
    config: {
      duration: (gameSettings?.turnDuration ?? 0) * 1000,
    },
  }));

  useEffect(() => {
    void timerSpringApi.start({
      from: { width: "100%" },
      to: { width: "0%" },
      config: {
        duration: (gameSettings?.turnDuration ?? 0) * 1000,
      },
    });
  }, [round, gameSettings?.turnDuration, timerSpringApi]);

  useEffect(() => {
    if (gameResult) {
      timerSpringApi.pause();
    }
  }, [gameResult, timerSpringApi]);

  return <Container $owner={owner} style={timerSpring} />;
};

export default TurnTimer;
