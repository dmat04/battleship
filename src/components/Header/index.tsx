import styled from 'styled-components';
import HeroBanner from './HeroBanner';
import ThemeToggle from './ThemeToggle';

const Container = styled.div`
    grid-area: header;
    display: grid;
    grid-template-areas: 
      "user theme"
      "hero hero";
    
`;

const Header = () => (
  <Container>
    <ThemeToggle />
    <HeroBanner />
  </Container>
);

export default Header;
