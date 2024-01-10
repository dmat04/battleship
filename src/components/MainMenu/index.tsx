import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useState } from 'react';
import type { RootState } from '../../store/store';
import Button from './Button';
import { Theme } from '../assets/themes/themeDefault';
import ButtonForm from './ButtonForm';

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
      <ButtonForm label="test" />
      <ButtonForm label="test2" />
      <Button label="Continue as guest" onClick={handleGuestLogin} />
      <Button label="Login" onClick={handleLogin} />
      <Button label="Register" onClick={handleRegister} />
    </MenuContainer>
  );
};

export default Menu;
