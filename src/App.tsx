import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import themeDefault from './components/assets/themes/themeDefault';
import themeDark from './components/assets/themes/themeDark';
import Navbar from './components/Navbar';

const App = () => (
  <ThemeProvider theme={themeDefault}>
    <div className="App">
      <BrowserRouter>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<div>Hello world</div>} />
          </Routes>
        </>
      </BrowserRouter>
    </div>
  </ThemeProvider>
);

export default App;
