import styled from 'styled-components';

const SvgText = styled.text`
  font-weight: 900;
  font-stretch: normal;
  font-size: 5rem;
  fill: #975218;
  stroke: #975218;
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: none;
  stroke-opacity: 1;
  paint-order: stroke markers fill;
`;

const WIDTH = 700;
const HEIGHT = 100;

const Logo = () => (
  <svg
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    version="1.1"
    id="svg1"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      paddingBlock: '3rem',
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
);

export default Logo;
