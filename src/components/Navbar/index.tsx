import { useState } from 'react';
import styled from 'styled-components';
import IconMenu from '../assets/icons/ic_menu.svg';
import IconClose from '../assets/icons/ic_close.svg';
import { Theme } from '../assets/themes/themeDefault';

const NavContainer = styled.nav<{ theme: Theme }>`
  --bg-color: ${(props) => props.theme.colorSecondary};
  --border-color: ${(props) => props.theme.colorPrimary};
  --gap: ${(props) => props.theme.paddingSm};
  --gap-smaller: ${(props) => props.theme.paddingMin};
  --border-size: ${(props) => props.theme.dimensionBorderSm};

  grid-area: navbar;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--gap) var(--gap-smaller);
  background-color: var(--bg-color);
  background-image:  
    linear-gradient(var(--border-color) var(--border-size), transparent var(--border-size)),
    linear-gradient(to right, var(--border-color) var(--border-size), transparent var(--border-size));
  background-size: 2.5vh 2.5vh;
  background-position: center center;
  border: var(--border-size) solid var(--border-color);
`;

const NavList = styled.ul<{ theme: Theme, $navOpen: boolean }>`
  --gap: ${(props) => props.theme.paddingSm};
  --duration: ${(props) => `${props.theme.durationTransitionDefault}ms`};
  
  display: flex;
  gap: var(--gap);
  list-style: none;
  background: hsl(0 0% 100% / 0.1);
  backdrop-filter: blur(0.1rem);

  @media (max-width: 35em) {
    position: fixed;
    z-index: 1000;
    inset: 0 0 0 0;
    flex-direction: column;
    padding: min(20vh, 10rem) var(--gap);
    ${(props) => (props.$navOpen ? '' : 'transform: translateX(100%);')}
    transition: transform var(--duration) ease-out;
  }
`;

const NavListItem = styled.li`
  
`;

const NavItem = styled.a`
  
`;

const NavLogo = styled.div`
  --gap: ${(props) => props.theme.paddingSm};
  --gap-smaller: ${(props) => props.theme.paddingMin};
  
  font-size: x-large;
  font-weight: bolder;
  padding: var(--gap);
  color: white;
  border-radius: 10px;
  background-color: #4e2e82;
`;

const MobileToggle = styled.button<{ theme: Theme, $navOpen: boolean }>`
  display: none;

  @media (max-width: 35em) {
    --border-size: ${(props) => props.theme.dimensionBorder};
    --bg-size: ${(props) => props.theme.dimensionIconSize};

    display: block;
    width: 3rem;
    aspect-ratio: 1;
    z-index: 9999;
    border: var(--border-size) solid #444cf7;
    border-radius: 50%;
    background: ${(props) => (
    props.$navOpen
      ? `url(${IconClose}), hsl(0 0% 100% / 1)`
      : `url(${IconMenu}), hsl(0 0% 100% / 1)`
  )};
    background-size: var(--bg-size) var(--bg-size);
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const Navbar = () => {
  const [navOpen, setNavOpen] = useState<boolean>(false);

  return (
    <NavContainer>
      <NavLogo>Battleship</NavLogo>
      <MobileToggle $navOpen={navOpen} onClick={() => setNavOpen(!navOpen)} />
      <NavList $navOpen={navOpen}>
        {/* <NavListItem>
          <NavItem>
            <UserItem />
          </NavItem>
        </NavListItem>
        <NavListItem>
          <NavItem>
            Link A
          </NavItem>
        </NavListItem>
        <NavListItem>
          <NavItem>
            Link B
          </NavItem>
        </NavListItem> */}
      </NavList>
    </NavContainer>
  );
};

export default Navbar;
