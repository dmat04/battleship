import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { styled } from "styled-components";
import { Helmet } from "react-helmet";
import UserMenu from "./components/UserMenu/index.jsx";
import GameRoomMenu from "./components/GameRoomMenu/index.jsx";
import GameScreen from "./components/GameScreen/index.jsx";
import PlacementScreen from "./components/GameScreen/PlacementScreen/index.jsx";
import ActiveGameScreen from "./components/GameScreen/ActiveGameScreen/index.jsx";
import NotificationOverlay from "./components/NotificationOverlay/index.jsx";
import Header from "./components/Header/index.jsx";
import ThemeProvider from "./components/ThemeProvider/index.jsx";
import { Theme } from "./components/assets/themes/themeDefault.js";

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
  return (
    <ThemeProvider>
      <Helmet>
        <title>Battleship</title>
      </Helmet>

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
