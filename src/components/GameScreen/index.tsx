import { Outlet } from 'react-router-dom';
import StatusHeader from './StatusHeader';

const GameScreen = () => (
  <div>
    <StatusHeader />
    <Outlet />
  </div>
);

export default GameScreen;
