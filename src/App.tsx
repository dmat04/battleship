import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import themeDefault from './components/assets/themes/themeDefault';
import Navbar from './components/Navbar';
import PlacementGrid from './components/PlacementGrid';

const ScreenContainer = styled.div`
  width: 40vw;
  margin: auto;
  padding-top: 2em;

  @media (max-width: 35em) {
    width: 80vw;
  }
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
