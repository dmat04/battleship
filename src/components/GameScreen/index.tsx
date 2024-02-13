import { Outlet } from 'react-router-dom';
import StatusMessage from './ActiveGameScreen/ScoreBoard/StatusMessage';

const GameScreen = () => (
  <div>
    <StatusMessage />
    <Outlet />
  </div>
);

export default GameScreen;
