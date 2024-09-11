import { styled } from "styled-components";
import { useAppSelector } from "../../../../store/store.js";
import { GameRoomIsReady } from "../../../../store/gameRoomSlice/stateTypes.js";
import { Theme } from "../../../assets/themes/themeDefault.js";
import PlayerScorecard from "./PlayerScorecard.js";

const Container = styled.div<{ theme: Theme }>`
  grid-area: score;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-column-gap: ${(props) => props.theme.paddingSm};
`;

export type Owner = "player" | "opponent";

const Scoreboard = () => {
  const gameRoom = useAppSelector((state) => state.gameRoom);

  if (!GameRoomIsReady(gameRoom) || !gameRoom.gameStarted) return null;

  return (
    <Container>
      <PlayerScorecard owner="player" ownerDetails={gameRoom.player} />
      <PlayerScorecard
        owner="opponent"
        ownerDetails={gameRoom.opponent}
      />
    </Container>
  );
};

export default Scoreboard;
