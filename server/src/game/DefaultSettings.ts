import { GameSettings } from '../graphql/types.generated';

const DefaultSettings: GameSettings = {
  boardWidth: 10,
  boardHeight: 10,
  availableShips: [
    { shipID: 'CARRIER-0', size: 5, type: 'CARRIER' },
    { shipID: 'BATTLESHIP-0', size: 4, type: 'BATTLESHIP' },
    { shipID: 'CRUISER-0', size: 3, type: 'CRUISER' },
    { shipID: 'DESTROYER-0', size: 2, type: 'DESTROYER' },
    { shipID: 'DESTROYER-1', size: 2, type: 'DESTROYER' },
    { shipID: 'SUBMARINE-0', size: 1, type: 'SUBMARINE' },
    { shipID: 'SUBMARINE-1', size: 1, type: 'SUBMARINE' },
  ],
  turnDuration: 20,
};

export default DefaultSettings;
