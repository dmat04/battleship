import styled, { keyframes, useTheme } from 'styled-components';
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
  $opacity: number;
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
    opacity: ${(props) => props.$opacity};
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
  position: relative;
  grid-area: navbar;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.color100};
  isolation: isolate;
`;

const Navbar = () => {
  const theme = useTheme() as Theme;

  const waveColor = theme.color400;
  const appBgColor = theme.color300;

  return (
    <NavContainer>
      <WaveContainer
        $color={waveColor}
        $opacity={0.5}
        $offset={75}
        $width={500}
        $height={65}
        $duration={80}
      />
      <WaveContainer
        $color={waveColor}
        $opacity={0.5}
        $offset={50}
        $width={400}
        $height={60}
        $duration={60}
      />
      <WaveContainer
        $color={waveColor}
        $opacity={0.5}
        $offset={25}
        $width={300}
        $height={55}
        $duration={40}
      />
      <WaveContainer
        $color={appBgColor}
        $opacity={1}
        $offset={0}
        $width={200}
        $height={25}
        $duration={30}
      />
      <Logo />
    </NavContainer>
  );
};

export default Navbar;
