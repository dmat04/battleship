import styled from 'styled-components';
import { useAppSelector } from '../../store/store';
import { Theme } from '../assets/themes/themeDefault';
import { PlayerStatus } from '../../store/gameRoomSlice/stateTypes';

const Container = styled.div<{ theme: Theme }>`
  padding: ${(props) => props.theme.paddingMin};
  border: 2px solid black;
  background-color: #8bd2d6;
  text-align: center;
`;

const Highlight = styled.span`
  font-weight: bolder;
`;

const InviteCodeInfo = () => {
  const { inviteCode, opponentStatus } = useAppSelector((state) => state.gameRoom);

  if (!inviteCode || opponentStatus !== PlayerStatus.Disconnected) return null;

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
