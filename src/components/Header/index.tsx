import styled from 'styled-components';
import HeroBanner from './HeroBanner';
import ThemeToggle from './ThemeToggle';
import { Theme } from '../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
    grid-area: header;
    display: grid;
    grid-template-areas: 
      "user theme"
      "hero hero";
    background-color: ${(props) => props.theme.colors.surfaceTertiary};
`;

const Header = () => (
  <Container>
    <ThemeToggle />
    <HeroBanner />
  </Container>
);

export default Header;
