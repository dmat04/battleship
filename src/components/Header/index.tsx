import styled from 'styled-components';
import HeroBanner from './HeroBanner';
import ThemeToggle from './ThemeToggle';
import { Theme } from '../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
    grid-area: header;
    display: grid;
    grid-template-areas: 
      "theme user"
      "hero hero";
    grid-template-rows: auto auto;
    grid-template-columns: auto auto;
    background-color: ${(props) => props.theme.colors.surfaceTertiary};
`;

const Header = () => (
  <Container>
    <ThemeToggle />
    <HeroBanner />
  </Container>
);

export default Header;
