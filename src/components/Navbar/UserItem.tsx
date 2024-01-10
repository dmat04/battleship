import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import IconUser from '../assets/icons/ic_account_circe.svg';
import { Theme } from '../assets/themes/themeDefault';
import LoginForm from './LoginForm';

const Container = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const Icon = styled.div<{ theme: Theme }>`
  --border-size: ${(props) => props.theme.dimensionBorder};
  --size: ${(props) => props.theme.dimensionIconSize};

  width: var(--size);
  aspect-ratio: 1;
  border-radius: 50%;
  background-image: url(${IconUser});
  background-color: white;
  background-size: var(--size) var(--size);
  background-position: center;
  background-repeat: no-repeat;
`;

const LogoutButton = styled.button`
  
`;

const UserItem = () => {
  const { token, login, logout } = useAuth();

  if (!token) {
    return <LoginForm login={login} />;
  }

  return (
    <Container>
      <Icon />
      { token.username }
      <LogoutButton onClick={() => logout()}>logout</LogoutButton>
    </Container>
  );
};

export default UserItem;
