import styled from 'styled-components';
import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Theme } from '../assets/themes/themeDefault';
import CollapsibleContainer, { CollapsibleAPI } from '../CollapsibleContainer';
import Button from '../Button';
import MenuItemLabel from '../MemuItemLabel';
import JoinGameForm from './JoinGameForm';
import { createGameRoom } from '../../store/gameRoomSlice';
import Spinner from '../Spinner';

const MenuContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const GameRoomMenu = () => {
  const dispatch = useAppDispatch();
  const fetchingRoom = useAppSelector((state) => state.gameRoom.fetchingRoom);
  const fetchinSettings = useAppSelector((state) => state.gameRoom.fetchingSettings);
  const [requestType, setRequestType] = useState<'join' | 'new' | null>(null);

  const collapsible = useRef<CollapsibleAPI>(null);
  const [collapsibleOpen, setCollapsibleOpen] = useState<boolean>(false);

  const startNewGame = () => {
    if (fetchingRoom || fetchinSettings) return;

    collapsible.current?.setCollapsed(true);
    setRequestType('new');
    dispatch(createGameRoom());
  };

  return (
    <MenuContainer>
      <Button $variant="primary" onClick={startNewGame}>
        {
          (requestType === 'new' && (fetchingRoom || fetchinSettings))
            ? <Spinner $visible />
            : <MenuItemLabel>Start a new game</MenuItemLabel>
        }
      </Button>

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
