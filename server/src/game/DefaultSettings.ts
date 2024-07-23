import { GameSettings, ShipClassName } from "@battleship/common/types/__generated__/types.generated.js";

const DefaultSettings: GameSettings = {
  boardWidth: 10,
  boardHeight: 10,
  availableShips: [
    { shipID: "CARRIER-0", size: 5, type: ShipClassName.Carrier },
    { shipID: "BATTLESHIP-0", size: 4, type: ShipClassName.Battleship },
    { shipID: "CRUISER-0", size: 3, type: ShipClassName.Cruiser },
    { shipID: "DESTROYER-0", size: 2, type: ShipClassName.Destroyer },
    { shipID: "DESTROYER-1", size: 2, type: ShipClassName.Destroyer },
    { shipID: "SUBMARINE-0", size: 1, type: ShipClassName.Submarine },
    { shipID: "SUBMARINE-1", size: 1, type: ShipClassName.Submarine },
  ],
  turnDuration: 20,
};

export default DefaultSettings;
