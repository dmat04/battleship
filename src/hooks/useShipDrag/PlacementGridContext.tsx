import { createContext } from 'react';

export interface IPlacementGridContext {
  componentContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  gridContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const defaultValue: IPlacementGridContext = {
  componentContainerRef: { current: null },
  gridContainerRef: { current: null },
};

const PlacementGridContext = createContext<IPlacementGridContext>(defaultValue);

export default PlacementGridContext;
