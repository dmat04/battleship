import styled from 'styled-components';
import { useCallback, useRef } from 'react';
import { Theme } from '../assets/themes/themeDefault';
import ButtonForm, { ButtonFormAPI } from './ButtonForm';

const MenuContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

interface ButtonHandles {
  key: string;
  formButton: ButtonFormAPI;
}

const Menu = () => {
  const btnRefs = useRef<ButtonHandles[]>([]);

  const addBtnRef = useCallback((key: string, handle: ButtonFormAPI | null) => {
    if (!handle) return;
    if (btnRefs.current.findIndex((item) => item.key === key) >= 0) return;

    btnRefs.current.push({ key, formButton: handle });
  }, []);

  const closeOthers = useCallback((key: string) => {
    btnRefs.current.forEach((handle) => {
      if (handle.key !== key) handle.formButton.setCollapsed(true);
    });
  }, []);

  return (
    <MenuContainer>
      <ButtonForm
        label="Continue as guest"
        ref={(api) => addBtnRef('guest', api)}
        onClick={(collapsed) => { if (!collapsed) closeOthers('guest'); }}
      >
        <form>
          <input type="text" placeholder="Pick a username?" />
          <button type="button">Continue</button>
        </form>
      </ButtonForm>

      <ButtonForm
        label="Login"
        ref={(api) => addBtnRef('login', api)}
        onClick={(collapsed) => { if (!collapsed) closeOthers('login'); }}
      >
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="button">Log in</button>
        </form>
      </ButtonForm>

      <ButtonForm
        label="Register"
        ref={(api) => addBtnRef('register', api)}
        onClick={(collapsed) => { if (!collapsed) closeOthers('register'); }}
      >
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="button">Log in</button>
        </form>
      </ButtonForm>
    </MenuContainer>
  );
};

export default Menu;
