import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

const App = () => (
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

);

export default App;
