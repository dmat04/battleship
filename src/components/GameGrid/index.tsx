import styled from 'styled-components';
import { Theme } from '../assets/themes/themeDefault';

const GameGrid = styled.div<{ $cols: number, $rows: number, theme: Theme }>`
  --cols: ${(props) => props.$cols};
  --rows: ${(props) => props.$rows};
  
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
  aspect-ratio: 1;
  background-color: ${(props) => props.theme.colors.surfaceSecondary};
  background-image:
    linear-gradient(black .2em, transparent .2em),
    linear-gradient(to right, black .2em, transparent .2em),
    linear-gradient(black .4em, transparent .4em),
    linear-gradient(to right, black .4em, transparent .4em);
  background-size: 
    calc(100% / var(--cols)) calc(100% / var(--rows)),
    calc(100% / var(--cols)) calc(100% / var(--rows)),
    100% 100%,
    100% 100%;
  background-position: 
    left -.1em top -.1em,
    left -.1em top -.1em,
    left -.2em top -.2em,
    left -.2em top -.2em;
`;

export default GameGrid;
