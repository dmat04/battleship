import styled, { keyframes } from 'styled-components';
import { Theme } from '../assets/themes/themeDefault';
import Logo from './Logo';

const bgAnim = (width: number, offset: number) => keyframes`
  0% {
    background-position: ${offset}% bottom;
  }

  100% {
    background-position: ${width + offset}% bottom;
  }
`;

const waveSVG = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 2.75" preserveAspectRatio="none">
  <path d="M 0 1 C 1 0 1 0 2 1 C 3 2 3 2 4 1 V 3 H 0 Z" fill="${color}"/>
</svg>
`;

const bgImageURL = (color: string) => `url("data:image/svg+xml,${encodeURIComponent(waveSVG(color))}")`;

interface WaveContainerProps {
  $color: string;
  $width: number;
  $height: number;
  $offset: number;
  $duration: number;
}

const WaveContainer = styled.div<WaveContainerProps>`
    position: absolute;
    bottom: 0;
    height: 100%;
    width: 100%;
    background-image: ${(props) => bgImageURL(props.$color)};
    background-repeat: repeat-x;
    background-size: ${(props) => props.$width}% ${(props) => props.$height}%;
    animation: 
      ${(props) => props.$duration}s
      ${(props) => bgAnim(props.$width, props.$offset)}
      infinite
      linear;
`;

const NavContainer = styled.nav<{ theme: Theme }>`
  --bg-color: ${(props) => props.theme.colorSecondary};
  --border-color: ${(props) => props.theme.colorPrimary};
  --gap: ${(props) => props.theme.paddingSm};
  --gap-smaller: ${(props) => props.theme.paddingMin};
  --border-size: ${(props) => props.theme.dimensionBorderSm};

  position: relative;
  grid-area: navbar;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  isolation: isolate;
`;

const Navbar = () => (
  <NavContainer>
    <WaveContainer $color="hsl(200, 100%, 50%, 50%)" $offset={66} $width={300} $height={60} $duration={40} />
    <WaveContainer $color="hsl(200, 100%, 50%, 50%)" $offset={33} $width={400} $height={50} $duration={60} />
    <WaveContainer $color="hsl(200, 100%, 50%, 50%)" $offset={0} $width={500} $height={45} $duration={90} />
    <Logo />
  </NavContainer>
);

export default Navbar;
