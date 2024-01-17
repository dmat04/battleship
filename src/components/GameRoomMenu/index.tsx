import styled from 'styled-components';
import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Theme } from '../assets/themes/themeDefault';
import CollapsibleContainer, { CollapsibleAPI } from '../CollapsibleContainer';
import MenuItemLabel from '../MemuItemLabel';
import JoinGameForm from './JoinGameForm';
import { createGameRoom } from '../../store/gameRoomSlice';
import Spinner from '../Spinner';
import { MenuItemButton } from '../Button';

const MenuContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const GameRoomMenu = () => {
  const dispatch = useAppDispatch();
  const roomID = useAppSelector((state) => state.gameRoom.roomID);
  const auth = useAppSelector((state) => state.auth.loginResult);
  const loadingNewRoom = useAppSelector((state) => state.gameRoom.loadingNewRoom);

  const collapsible = useRef<CollapsibleAPI>(null);
  const [collapsibleOpen, setCollapsibleOpen] = useState<boolean>(false);

  const startNewGame = () => {
    if (loadingNewRoom) return;

    collapsible.current?.setCollapsed(true);
    dispatch(createGameRoom());
  };

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (roomID) {
    return <Navigate to="/getReady" replace />;
  }

  return (
    <MenuContainer>
      <MenuItemButton $variant="primary" onClick={startNewGame}>
        {
          loadingNewRoom
            ? <Spinner $visible />
            : <MenuItemLabel>Start a new game</MenuItemLabel>
        }
      </MenuItemButton>

      <CollapsibleContainer
        ref={collapsible}
        label="Join a game"
        onCollapsedStateChange={(collapsed) => setCollapsibleOpen(collapsed)}
      >
        <JoinGameForm disabled={collapsibleOpen} />
      </CollapsibleContainer>
    </MenuContainer>
  );
};

export default GameRoomMenu;
