import styled from 'styled-components';
import { useCallback, useRef } from 'react';
import { Theme } from '../assets/themes/themeDefault';
import CollapsibleContainer, { CollapsibleAPI } from './CollapsibleContainer';
import GuestForm from './GuestForm';

const MenuContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

interface CollapsibleHandles {
  key: string;
  collapsible: CollapsibleAPI;
}

const Menu = () => {
  const collapsibleRefs = useRef<CollapsibleHandles[]>([]);

  const addCollapsibleRef = useCallback((key: string, handle: CollapsibleAPI | null) => {
    if (!handle) return;
    if (collapsibleRefs.current.findIndex((item) => item.key === key) >= 0) return;

    collapsibleRefs.current.push({ key, collapsible: handle });
  }, []);

  const closeOthers = useCallback((key: string) => {
    collapsibleRefs.current.forEach((handle) => {
      if (handle.key !== key) handle.collapsible.setCollapsed(true);
    });
  }, []);

  return (
    <MenuContainer>
      <CollapsibleContainer
        label="Continue as guest"
        ref={(api) => addCollapsibleRef('guest', api)}
        onClick={(collapsed) => { if (!collapsed) closeOthers('guest'); }}
      >
        <GuestForm />
      </CollapsibleContainer>

      <CollapsibleContainer
        label="Login"
        ref={(api) => addCollapsibleRef('login', api)}
        onClick={(collapsed) => { if (!collapsed) closeOthers('login'); }}
      >
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="button">Log in</button>
        </form>
      </CollapsibleContainer>

      <CollapsibleContainer
        label="Register"
        ref={(api) => addCollapsibleRef('register', api)}
        onClick={(collapsed) => { if (!collapsed) closeOthers('register'); }}
      >
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="button">Log in</button>
        </form>
      </CollapsibleContainer>
    </MenuContainer>
  );
};

export default Menu;
