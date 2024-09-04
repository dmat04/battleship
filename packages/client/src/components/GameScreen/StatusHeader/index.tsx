import { styled } from "styled-components";
import { useEffect, useRef } from "react";
import { PlayerStatus } from "../../../store/gameRoomSlice/stateTypes.js";
import { useAppSelector } from "../../../store/store.js";
import OpponentStatus from "./OpponentStatus.js";
import InviteCode from "./InviteCode.js";
import { Theme } from "../../assets/themes/themeDefault.js";
import CollapsibleContainer, {
  CollapsibleAPI,
} from "../../CollapsibleContainer/index.js";

const Container = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const StatusHeader = () => {
  const { inviteCode, opponentStatus, gameStarted, gameResult } =
    useAppSelector((state) => state.gameRoom);
  const inviteCodeCollapsible = useRef<CollapsibleAPI>(null);
  const opponentStatusCollapsible = useRef<CollapsibleAPI>(null);

  useEffect(() => {
    if (gameResult || gameStarted) {
      inviteCodeCollapsible.current?.setState("closed");
      opponentStatusCollapsible.current?.setState("closed");
      return;
    }

    if (inviteCode && opponentStatus === PlayerStatus.Disconnected) {
      inviteCodeCollapsible.current?.setState("open");
    } else {
      inviteCodeCollapsible.current?.setState("closed");
    }
  }, [inviteCode, opponentStatus, gameResult, gameStarted]);

  return (
    <Container>
      <CollapsibleContainer
        initialState={inviteCode ? "open" : "closed"}
        ref={inviteCodeCollapsible}
      >
        <InviteCode data-testid="container-invite-code"/>
      </CollapsibleContainer>
      <CollapsibleContainer initialState="open" ref={opponentStatusCollapsible}>
        <OpponentStatus data-testid="container-opponent-status"/>
      </CollapsibleContainer>
    </Container>
  );
};

export default StatusHeader;
