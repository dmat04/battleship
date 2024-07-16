import { createContext, useContext } from 'react';
import { ThemeType } from '../assets/themes/themeDefault';

export type ThemePreference = ThemeType | 'system';

interface ThemePreferenceContextValue {
  theme: ThemeType;
  userPreference: ThemePreference;
  setUserPreference: (newTheme: ThemePreference) => void;
}

export const ThemePreferenceContext = createContext<ThemePreferenceContextValue>({
  theme: 'light',
  userPreference: 'system',
  setUserPreference: () => {},
});

export const useThemePreference = () => useContext(ThemePreferenceContext);
