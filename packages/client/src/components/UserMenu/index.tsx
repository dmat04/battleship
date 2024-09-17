import { styled } from "styled-components";
import { useCallback, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Theme } from "../assets/themes/themeDefault.js";
import { CollapsibleAPI } from "../CollapsibleContainer/index.js";
import GuestForm from "./GuestForm.js";
import { useAppSelector } from "../../store/store.js";
import CollapsibleButton from "../CollapsibleButton.js";
import LoginMenuItem from "./LoginMenuItem.js";

const MenuContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
  min-width: 20rem;
  width: min(90vw, 20rem);
`;

interface CollapsibleHandles {
  key: string;
  collapsible: CollapsibleAPI;
}

const UserMenu = () => {
  const collapsibleRefs = useRef<CollapsibleHandles[]>([]);
  const [opened, setOpened] = useState<string | null>(null);
  const { loginResult } = useAppSelector((state) => state.auth);

  const addCollapsibleRef = useCallback(
    (key: string, handle: CollapsibleAPI | null) => {
      if (!handle) return;
      if (collapsibleRefs.current.findIndex((item) => item.key === key) >= 0)
        return;

      collapsibleRefs.current.push({ key, collapsible: handle });
    },
    [],
  );

  const closeOthers = useCallback((key: string) => {
    collapsibleRefs.current.forEach((handle) => {
      if (handle.key !== key) handle.collapsible.setState("closed");
    });

    setOpened(key);
  }, []);

  if (loginResult) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <MenuContainer>
      <CollapsibleButton
        label="Continue as guest"
        initialState="closed"
        ref={(api) => addCollapsibleRef("guest", api)}
        onCollapsedStateChange={(state) =>
          state === "closed" ? setOpened(null) : closeOthers("guest")
        }
      >
        <GuestForm disabled={opened !== "guest"} />
      </CollapsibleButton>

      <CollapsibleButton
        label="Login"
        initialState="closed"
        ref={(api) => addCollapsibleRef("login", api)}
        onCollapsedStateChange={(state) =>
          state === "closed" ? setOpened(null) : closeOthers("login")
        }
      >
        <LoginMenuItem disabled={opened !== "login"} />
      </CollapsibleButton>

      <CollapsibleButton
        label="Register"
        initialState="closed"
        ref={(api) => addCollapsibleRef("register", api)}
        onCollapsedStateChange={(state) =>
          state === "closed" ? setOpened(null) : closeOthers("register")
        }
      >
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="button">Log in</button>
        </form>
      </CollapsibleButton>
    </MenuContainer>
  );
};

export default UserMenu;
