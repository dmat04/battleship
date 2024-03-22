import { createContext, useContext } from 'react';
import { ThemeType } from '../../components/assets/themes/themeDefault';

interface ThemePreferenceContextValue {
  themePreference: ThemeType;
  setThemePreference: React.Dispatch<React.SetStateAction<ThemeType>>;
}

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

export const useThemePreferenceContext = () => useContext(ThemePreferenceContext);

export default ThemePreferenceContext.Provider;
