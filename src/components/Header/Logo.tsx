import styled from 'styled-components';
import { Theme } from '../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
  width: min(100%, 75rem);
  margin-inline: auto;
  padding-block: ${(props) => props.theme.paddingMin};
`;

const SvgText = styled.text<{ theme: Theme }>`
  font-weight: 900;
  font-stretch: normal;
  font-size: 5rem;
  fill: ${(props) => props.theme.colors.heroComplementary};
  stroke: ${(props) => props.theme.colors.heroComplementary};
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: none;
  paint-order: stroke fill markers;
  user-select: none;
`;

const WIDTH = 700;
const HEIGHT = 100;

const Logo = () => (
  <Container>
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      version="1.1"
      id="svg1"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        mixBlendMode: 'difference',
      }}
    >
      <defs id="defs1" />
      <g id="layer1">
        <rect width={WIDTH} height={HEIGHT} fill="none" stroke="none" />
        <SvgText
          x={WIDTH / 2}
          y={HEIGHT / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          id="text1"
        >
          Battleship
        </SvgText>
      </g>
    </svg>
  </Container>
);

export default Logo;
