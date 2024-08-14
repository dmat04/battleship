import { styled } from "styled-components";
import { useAppSelector } from "../../../store/store.js";
import { Theme } from "../../assets/themes/themeDefault.js";

const Container = styled.div<{ theme: Theme }>`
  width: min(100%, 30rem);
  padding: ${(props) => props.theme.paddingMin};
  border: ${(props) => props.theme.borderStyle};
  background-color: ${(props) => props.theme.colors.containerWarning};
  color: ${(props) => props.theme.colors.onContainerWarning};
  text-align: center;
`;

const Highlight = styled.span`
  font-weight: bolder;
`;

const InviteCode = () => {
  const { inviteCode } = useAppSelector((state) => state.gameRoom);

  if (!inviteCode) return null;

  return (
    <Container>
      <p>
        Game invite code:&nbsp;
        <Highlight>{inviteCode}</Highlight>
      </p>
    </Container>
  );
};

export default InviteCode;
