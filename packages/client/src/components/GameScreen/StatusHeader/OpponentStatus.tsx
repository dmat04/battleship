import { styled } from "styled-components";
import { PlayerStatus } from "../../../store/gameRoomSlice/stateTypes.js";
import { useAppSelector } from "../../../store/store.js";
import { assertNever } from "@battleship/common/utils/typeUtils.js";
import Spinner from "../../Spinner/Spinner.js";
import { Theme } from "../../assets/themes/themeDefault.js";

const Container = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const Label = styled.p<{ theme: Theme }>`
  text-align: center;
`;

const OpponentStatus = (props: object | undefined) => {
  const { opponentStatus, opponent } = useAppSelector(
    (state) => state.gameRoom,
  );

  let message = "";
  let success = false;

  switch (opponentStatus) {
    case PlayerStatus.Disconnected:
      message = "Waiting for an opponent to connect";
      break;
    case PlayerStatus.Connected:
      message = `${opponent?.username ?? "Opponent"} connected, waiting for them to get ready`;
      break;
    case PlayerStatus.Ready:
      message = `${opponent?.username ?? "Opponent"} ready`;
      success = true;
      break;
    default:
      assertNever(opponentStatus);
  }

  return (
    <Container { ...props }>
      <Label>{message}</Label>
      <Spinner visible success={success} />
    </Container>
  );
};

export default OpponentStatus;
