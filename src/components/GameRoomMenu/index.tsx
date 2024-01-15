import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/store';
import { Theme } from '../assets/themes/themeDefault';
import CollapsibleContainer, { CollapsibleAPI } from '../CollapsibleContainer';
import Button from '../Button';
import MenuItemLabel from '../MemuItemLabel';
import JoinGameForm from './JoinGameForm';

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

const GameRoomMenu = () => {
  const dispatch = useAppDispatch();

  return (
    <MenuContainer>
      <Button $variant="primary">
        <MenuItemLabel>Start a new game</MenuItemLabel>
      </Button>

      <CollapsibleContainer label="Join a game">
        <JoinGameForm disabled={false} />
      </CollapsibleContainer>
    </MenuContainer>
  );
};

export default GameRoomMenu;
