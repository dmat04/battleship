import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useState } from 'react';
import type { RootState } from '../../store/store';
import Button from './Button';
import { Theme } from '../assets/themes/themeDefault';
import ButtonForm, { MyComponent } from './ButtonForm';

const MenuContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const Menu = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const handleGuestLogin = () => {

  };

  const handleLogin = () => {

  };

  const handleRegister = () => {

  };

  return (
    <MenuContainer>
      <ButtonForm label="Continue as guest">
        <form>
          <input type="text" placeholder="Pick a username?" />
          <button type="button">Continue</button>
        </form>
      </ButtonForm>
      <ButtonForm label="Login">
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="button">Log in</button>
        </form>
      </ButtonForm>
      <ButtonForm label="Register" />
    </MenuContainer>
  );
};

export default Menu;
