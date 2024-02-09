import styled from 'styled-components';
import { useAppSelector } from '../store/store';
import { Theme } from './assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
  width: min(90vw, 30rem);
  padding: ${(props) => props.theme.paddingMin};
  border: 2px solid black;
  background-color: #8bd2d6;
  text-align: center;
`;

const Highlight = styled.span`
  font-weight: bolder;
`;

const InviteCodeInfo = () => {
  const inviteCode = useAppSelector((state) => state.gameRoom.inviteCode);

  if (!inviteCode) return null;

  return (
    <Container>
      <p>
        Game invite code:&nbsp;
        <Highlight>
          {inviteCode}
        </Highlight>
      </p>
    </Container>
  );
};

export default InviteCodeInfo;
