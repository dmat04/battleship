import { useCallback, useEffect, useState } from 'react';
import localStorageUtils from '../utils/localStorageUtils';
import { ThemeType } from '../components/assets/themes/themeDefault';

const useThemePreference = () => {
  const [themePreference, setThemePreference] = useState<ThemeType>('light');

  const setTheme = useCallback((theme: ThemeType) => {
    localStorageUtils.saveThemePreference(theme);
    setThemePreference(theme);
  }, []);

  useEffect(() => {
    const savedPreference = localStorageUtils.getThemePreference();

    const prefersLightQuery = window.matchMedia('(prefers-color-scheme: light)');
    const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    prefersLightQuery.onchange = (ev) => {
      if (ev.matches) {
        setThemePreference('light');
      }
    };

    prefersDarkQuery.onchange = (ev) => {
      if (ev.matches) {
        setThemePreference('dark');
      }
    };

    if (savedPreference) {
      setThemePreference(savedPreference);
    } else if (prefersLightQuery.matches) {
      setThemePreference('light');
    } else if (prefersDarkQuery.matches) {
      setThemePreference('dark');
    }

    return () => {
      prefersLightQuery.onchange = null;
      prefersDarkQuery.onchange = null;
    };
  }, []);

  return {
    themePreference,
    setTheme,
  };
};

export default useThemePreference;
