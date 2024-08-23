import { styled } from "styled-components";
import { useRef } from "react";
import IconContrast from "../assets/icons/ic_contrast.svg";
import IconDark from "../assets/icons/ic_dark_mode.svg";
import IconLight from "../assets/icons/ic_light_mode.svg";
import IconDevice from "../assets/icons/ic_devices.svg";
import {
  ThemePreference,
  useThemePreference,
} from "../ThemeProvider/ThemePreferenceContext.js";
import { Theme } from "../assets/themes/themeDefault.js";
import CollapsibleContainer, { CollapsibleAPI } from "../CollapsibleContainer/index.js";

const Container = styled.div<{ theme: Theme }>`
  --padding: ${(props) => props.theme.paddingMin};
  --gap: calc(${(props) => props.theme.paddingMin} / 2);
  --border-style: ${(props) => props.theme.borderStyle};

  grid-area: theme;
  position: relative;
  padding: var(--gap);
`;

const IconContainer = styled.button<{ theme: Theme }>`
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

const MenuContainer = styled.div`
  position: absolute;
  top: calc(100% + var(--gap));
  z-index: 9999;
`;

const MenuItemsContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: var(--gap);
  padding: var(--gap);
  border: var(--border-style);
  background-color: ${(props) => props.theme.colors.containerPrimary};
  color: ${(props) => props.theme.colors.onContainerPrimary};
`;

const MenuItem = styled.button<{ theme: Theme; $selected: boolean }>`
  --selected-filter: invert(10%) saturate(300%);

  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  color: ${(props) => props.theme.colors.onContainerPrimary};
  filter: ${(props) => (props.$selected ? "var(--selected-filter)" : "none")};

  &:hover {
    filter: var(--selected-filter);
  }
`;

const MenuIconContainer = styled.div<{ theme: Theme }>`
  width: min-content;
  border: var(--border-style);
  padding: var(--gap);
  display: flex;
  background-color: ${(props) => props.theme.colors.containerSecondary};
  color: ${(props) => props.theme.colors.onContainerSecondary};
`;

const MenuItemLabel = styled.p<{ theme: Theme }>`
  align-self: stretch;
  display: flex;
  align-items: center;
  padding-inline: var(--padding);
  width: 100%;
  border: var(--border-style);
  border-left: none;
  background-color: ${(props) => props.theme.colors.surfaceTertiary};
  color: ${(props) => props.theme.colors.onSurfaceTertiary};
`;

interface MenuItemProps {
  option: ThemePreference;
  icon: JSX.Element;
  label: string;
}

const MenuItems: MenuItemProps[] = [
  {
    option: "light",
    icon: <IconLight height={24} width={24} />,
    label: "Light",
  },
  {
    option: "dark",
    icon: <IconDark height={24} width={24} />,
    label: "Dark",
  },
  {
    option: "system",
    icon: <IconDevice height={24} width={24} />,
    label: "System",
  },
];

const ThemeToggle = () => {
  const { userPreference, setUserPreference } = useThemePreference();
  const menuRef = useRef<CollapsibleAPI>(null);

  const toggleMenu = () => {
    menuRef.current?.toggleState();
  };

  const optionSelectedBuilder = (selection: ThemePreference) => () => {
    setUserPreference(selection);
  };

  return (
    <Container onClick={toggleMenu}>
      <IconContainer>
        <IconContrast />
      </IconContainer>
      <MenuContainer>
        <CollapsibleContainer ref={menuRef}>
          <MenuItemsContainer>
            {MenuItems.map(({ option, icon, label }) => (
              <MenuItem
                key={option}
                $selected={option === userPreference}
                onClick={optionSelectedBuilder(option)}
              >
                <MenuIconContainer>{icon}</MenuIconContainer>
                <MenuItemLabel>{label}</MenuItemLabel>
              </MenuItem>
            ))}
          </MenuItemsContainer>
        </CollapsibleContainer>
      </MenuContainer>
    </Container>
  );
};

export default ThemeToggle;
