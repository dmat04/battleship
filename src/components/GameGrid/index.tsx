import styled from 'styled-components';
import { Theme } from '../assets/themes/themeDefault';

const Grid = styled.div<{ $cols: number, $rows: number, theme: Theme }>`
  --cols: ${(props) => props.$cols};
  --rows: ${(props) => props.$rows};
  
  display: grid;
  border: .2em solid black;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
  aspect-ratio: 1;
  background-image:  
    linear-gradient(black .2em, transparent .2em),
    linear-gradient(to right, black .2em, transparent .2em);
  background-size: calc(100% / var(--cols)) calc(100% / var(--rows));
  background-position: left -.1em top -.1em;
`;

const GameGrid = ({ children }: React.PropsWithChildren) => (
  <Grid $cols={10} $rows={10}>
    {children}
  </Grid>
);

export default GameGrid;
