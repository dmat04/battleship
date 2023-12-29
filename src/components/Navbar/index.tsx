import { useState } from 'react';
import styled from 'styled-components';
import IconMenu from './assets/ic_menu.svg';
import IconClose from './assets/ic_close.svg'

const NavContainer = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: space-between;
  height: calc(8rem + 1px);
  background-color: #e5e5f7;
  background-image:  linear-gradient(#444cf7 1px, transparent 1px), linear-gradient(to right, #444cf7 1px, #e5e5f7 1px);
  background-size: calc(8rem / 5) calc(8rem / 5);
  background-position: center top;
`;

// primary-navigation
const NavList = styled.ul<{ $navOpen: boolean }>`
  display: flex;
  gap: 2rem;
  padding: 1rem;
  list-style: none;
  background: hsl(0 0% 100% / 0.1);
  backdrop-filter: blur(0.1rem);

  @media (max-width: 35em) {
    position: fixed;
    z-index: 1000;
    inset: 0 0 0 20%;
    flex-direction: column;
    padding: min(20vh, 10rem) 2em;
    ${(props) => (props.$navOpen ? '' : 'transform: translateX(100%);')}
    transition: transform 250ms ease-out;
  }
`;

const NavListItem = styled.li`
  
`;

const NavItem = styled.a`
  
`;

const NavLogo = styled.div`
  aspect-ratio: 1;
  width: calc(3 * 8rem / 5);
  margin: 1.5rem;
  background-color: blueviolet;
`;

const MobileToggle = styled.button<{ $navOpen: boolean }>`
  display: none;

  @media (max-width: 35em) {
    display: block;
    /* position: absolute; */
    /* top: 2rem;
    right: 2rem; */
    margin: 1.5rem;
    z-index: 9999;
    border: 2px solid #444cf7;
    border-radius: 50%;
    background: ${(props) => (
    props.$navOpen
      ? `url(${IconClose}), hsl(0 0% 100% / 1)`
      : `url(${IconMenu}), hsl(0 0% 100% / 1)`
  )};
    background-size: 2em 2em;
    background-position: center;
    background-repeat: no-repeat;
    width: 3rem;
    aspect-ratio: 1;
  }
`;

const Navbar = () => {
  const [navOpen, setNavOpen] = useState<boolean>(false);

  return (
    <NavContainer>
      <NavLogo />
      <MobileToggle $navOpen={navOpen} onClick={() => setNavOpen(!navOpen)} />
      <NavList $navOpen={navOpen}>
        <NavListItem>
          <NavItem>
            Link1
          </NavItem>
        </NavListItem>
        <NavListItem>
          <NavItem>
            Link2
          </NavItem>
        </NavListItem>
        <NavListItem>
          <NavItem>
            Link3
          </NavItem>
        </NavListItem>
      </NavList>
    </NavContainer>
  )
};

export default Navbar;
