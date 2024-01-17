import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import themeDefault, { Theme } from './components/assets/themes/themeDefault';
import Navbar from './components/Navbar';
import UserMenu from './components/UserMenu';
import GameRoomMenu from './components/GameRoomMenu';
import PlacementScreen from './components/PlacementScreen';
import GameScreen from './components/GameScreen';

const ScreenContainer = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 1.5fr 10fr 1.5fr;
  grid-template-areas: 
    "navbar"
    "content"
    "footer";
`;

const MainContentContainer = styled.div<{ theme: Theme }>`
  grid-area: content;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: ${(props) => props.theme.paddingSm} 0;

  @media (max-width: 35em) {
    padding: ${(props) => props.theme.paddingMin} 0;
  }
`;

const TempFooter = styled.footer`
  background-color: antiquewhite;
  grid-area: footer;
`;

// eslint-disable-next-line arrow-body-style
const App = () => {
  return (
    <ThemeProvider theme={themeDefault}>
      <div className="App">
        <BrowserRouter>
          <ScreenContainer>
            <Navbar />
            <MainContentContainer>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<UserMenu />} />
                <Route path="/start" element={<GameRoomMenu />} />
                <Route path="/getReady" element={<PlacementScreen />} />
                <Route path="/game" element={<GameScreen />} />
              </Routes>
            </MainContentContainer>
            <TempFooter />
          </ScreenContainer>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
