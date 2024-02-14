import styled from 'styled-components';
import { SpringValues, animated } from '@react-spring/web';
import { useAppSelector } from '../../../store/store';
import { Theme } from '../../assets/themes/themeDefault';

const Container = styled(animated.div)<{ theme: Theme }>`
  padding: ${(props) => props.theme.paddingMin};
  border: 2px solid black;
  background-color: #8bd2d6;
  text-align: center;
`;

const Highlight = styled.span`
  font-weight: bolder;
`;

const InviteCode = ({ style }: { style: SpringValues }) => {
  const { inviteCode } = useAppSelector((state) => state.gameRoom);

  if (!inviteCode) return null;

  return (
    <Container style={style}>
      <p>
        Game invite code:&nbsp;
        <Highlight>
          {inviteCode}
        </Highlight>
      </p>
    </Container>
  );
};

export default InviteCode;
