import { GameSettings } from '../graphql/types.generated';

const DefaultSettings: GameSettings = {
  boardWidth: 10,
  boardHeight: 10,
  availableShips: [
    { shipID: 'Carrier-0', size: 5, type: 'CARRIER' },
    { shipID: 'Battleship-0', size: 4, type: 'BATTLESHIP' },
    { shipID: 'Cruiser-0', size: 3, type: 'CRUISER' },
    { shipID: 'Destroyer-0', size: 2, type: 'DESTROYER' },
    { shipID: 'Destroyer-1', size: 2, type: 'DESTROYER' },
    { shipID: 'Submarine-0', size: 1, type: 'SUBMARINE' },
    { shipID: 'Submarine-1', size: 1, type: 'SUBMARINE' },
  ],
  turnDuration: 20,
};

export default DefaultSettings;
