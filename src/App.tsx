import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import themeDefault from './components/assets/themes/themeDefault';
import Navbar from './components/Navbar';
import PlacementGrid from './components/PlacementGrid';
import Menu from './components/MainMenu';

const ScreenContainer = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 1.5fr 10fr 1.5fr;
  grid-template-areas: 
    "navbar"
    "content"
    "footer";
`;

const MainContentContainer = styled.div`
  grid-area: content;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const TempFooter = styled.footer`
  background-color: antiquewhite;
  grid-area: footer;
`;

const App = () => (
  <ThemeProvider theme={themeDefault}>
    <div className="App">
      <BrowserRouter>
        <ScreenContainer>
          <Navbar />
          <MainContentContainer>
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/startGame" element={<PlacementGrid />} />
            </Routes>
          </MainContentContainer>
          <TempFooter />
        </ScreenContainer>
      </BrowserRouter>
    </div>
  </ThemeProvider>
);

export default App;
