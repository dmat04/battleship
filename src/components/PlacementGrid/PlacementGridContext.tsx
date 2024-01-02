import { createContext } from 'react';

export interface IPlacementGridContext {
  gridContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const defaultValue: IPlacementGridContext = {
  gridContainerRef: { current: null },
};

const PlacementGridContext = createContext<IPlacementGridContext>(defaultValue);

export default PlacementGridContext;
