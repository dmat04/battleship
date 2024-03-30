import styled from 'styled-components';
import { ReactComponent as IconLogout } from '../assets/icons/ic_logout.svg';
import { ReactComponent as IconUser } from '../assets/icons/ic_account_circe.svg';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Theme } from '../assets/themes/themeDefault';
import { clearAuth } from '../../store/authSlice';

const Container = styled.div<{ theme: Theme }>`
  --padding: ${(props) => props.theme.paddingMin};
  --gap: calc(${(props) => props.theme.paddingMin} / 2);

  grid-area: user;
  align-self: center;
  justify-self: end;
  margin-inline: var(--padding);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--gap);
  font-weight: 900;
`;

const LogoutButton = styled.button<{ theme: Theme }>`
  width: min-content;
  border-radius: 50%;
  padding: var(--gap);
  display: flex;
  background-color: ${(props) => props.theme.colors.surfaceTertiary};
  color: ${(props) => props.theme.colors.onSurfaceTertiary};
  
  &:hover {
    filter: invert(10%) saturate(300%);
  }
`;

const UserInfo = () => {
  const auth = useAppSelector((state) => state.auth.loginResult);
  const dispatch = useAppDispatch();

  if (!auth) return null;

  const doLogout = () => {
    dispatch(clearAuth());
  };

  return (
    <Container>
      <IconUser width={24} height={24} />
      {auth.username}
      <LogoutButton onClick={doLogout}>
        <IconLogout width={24} height={24} />
      </LogoutButton>
    </Container>
  );
};

export default UserInfo;
