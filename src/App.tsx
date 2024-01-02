import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import themeDefault from './components/assets/themes/themeDefault';
import Navbar from './components/Navbar';
import HomeScreen from './components/HomeScreen';
import GameGrid from './components/GameGrid';
import PlacementGrid from './components/PlacementGrid';

const ScreenContainer = styled.div`
  width: 40vw;
  margin: auto;
  padding-top: 2em;

  @media (max-width: 35em) {
    width: 80vw;
  }
`;

const Ship = styled.div`
  background-color: powderblue;
  grid-column: 3 / span 5;
  grid-row: 4;
`;

const App = () => (
  <ThemeProvider theme={themeDefault}>
    <div className="App">
      <BrowserRouter>
        <>
          <Navbar />
          <ScreenContainer>
            <Routes>
              <Route path="/" element={<PlacementGrid />} />
            </Routes>
          </ScreenContainer>
        </>
      </BrowserRouter>
    </div>
  </ThemeProvider>
);

export default App;
