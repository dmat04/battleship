import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import themeDefault, { Theme } from './components/assets/themes/themeDefault';
import themeDark from './components/assets/themes/themeDark';
import UserMenu from './components/UserMenu';
import GameRoomMenu from './components/GameRoomMenu';
import GameScreen from './components/GameScreen';
import PlacementScreen from './components/GameScreen/PlacementScreen';
import ActiveGameScreen from './components/GameScreen/ActiveGameScreen';
import NotificationOverlay from './components/NotificationOverlay';
import useThemePreference from './hooks/useThemePreference';
import { assertNever } from './utils/typeUtils';
import Header from './components/Header';

const ScreenContainer = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "header"
    "content"
    "footer";
`;

const MainContentContainer = styled.div<{ theme: Theme }>`
  position: relative;
  grid-area: content;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.onSurfacePrimary};
  background-color: ${(props) => props.theme.colors.surfacePrimary};
  padding-block: ${(props) => props.theme.paddingSm};

  @media (max-width: 35em) {
    padding-block: ${(props) => props.theme.paddingMin};
  }
`;

const TempFooter = styled.footer<{ theme: Theme }>`
  background-color: ${(props) => props.theme.colors.surfacePrimary};
  grid-area: footer;
  height: 10vh;
`;

// eslint-disable-next-line arrow-body-style
const App = () => {
  const { themePreference } = useThemePreference();

  let theme = themeDefault;
  switch (themePreference) {
    case 'light': break;
    case 'dark': theme = themeDark; break;
    default: assertNever(themePreference);
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <ScreenContainer>
            <Header />
            <MainContentContainer>
              <Routes>
                <Route index element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<UserMenu />} />
                <Route path="/menu" element={<GameRoomMenu />} />
                <Route path="/game" element={<GameScreen />}>
                  <Route path="getReady" element={<PlacementScreen />} />
                  <Route path="play" element={<ActiveGameScreen />} />
                </Route>
              </Routes>
            </MainContentContainer>
            <TempFooter />
          </ScreenContainer>
        </BrowserRouter>
        <NotificationOverlay />
      </div>
    </ThemeProvider>
  );
};

export default App;
