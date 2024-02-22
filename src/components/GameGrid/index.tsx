import styled from 'styled-components';
import { Theme } from '../assets/themes/themeDefault';

const GameGrid = styled.div<{ $cols: number, $rows: number, theme: Theme }>`
  --cols: ${(props) => props.$cols};
  --rows: ${(props) => props.$rows};
  --thickness: 0.2em;
  
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
  aspect-ratio: 1;
  background-color: ${(props) => props.theme.colors.surfaceSecondary};
  background-image:
    linear-gradient(white var(--thickness), transparent var(--thickness)),
    linear-gradient(to right, white var(--thickness), transparent var(--thickness)),
    linear-gradient(white var(--thickness), transparent var(--thickness)),
    linear-gradient(to right, white var(--thickness), transparent var(--thickness));
  background-size: 
    100% calc(100% - var(--thickness)),
    calc(100% - var(--thickness)) 100%,
    calc(100% / var(--cols)) calc(100% / var(--rows)),
    calc(100% / var(--cols)) calc(100% / var(--rows));
  background-position: 
    left 0 top 0,
    left 0 top 0,
    left calc(var(--thickness) / -2) top calc(var(--thickness) / -2),
    left calc(var(--thickness) / -2) top calc(var(--thickness) / -2);
`;

export default GameGrid;
