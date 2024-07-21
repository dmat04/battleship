import styled from "styled-components";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GameOverModal from "./GameOverModal";
import { useAppSelector } from "../../../store/store";
import { Theme } from "../../assets/themes/themeDefault";
import LiveGameGrid from "./LiveGameGrid";
import Scoreboard from "./ScoreBoard";

const Container = styled.div<{ theme: Theme }>`
  display: grid;
  grid-template-areas:
    "score score"
    "player opponent";
  grid-template-rows: 1fr 5fr;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: ${(props) => props.theme.paddingSm};
  grid-column-gap: ${(props) => props.theme.paddingSm};
  width: min(60vw, 70rem);

  @media (max-width: 40rem) {
    width: 95vw;
  }

  @media (max-width: 60rem) {
    grid-template-areas:
      ". player ."
      "score score score"
      "opponent opponent opponent";
    grid-template-rows: none;
    grid-template-columns: 1fr 2.5fr 1fr;
  }
`;

const GameScreen = () => {
  const gameRoom = useAppSelector((state) => state.gameRoom);
  const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false);

  useEffect(() => {
    if (gameRoom.gameResult) {
      setTimeout(() => {
        setShowGameOverModal(true);
      }, 2000);
    }
  }, [gameRoom.gameResult]);

  if (!gameRoom.playerShips) {
    return <Navigate to="/game/getReady" replace />;
  }

  return (
    <Container>
      <LiveGameGrid owner="player" />
      <Scoreboard />
      <LiveGameGrid owner="opponent" />
      {showGameOverModal && <GameOverModal />}
    </Container>
  );
};

export default GameScreen;
