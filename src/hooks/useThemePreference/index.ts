import { useCallback, useEffect } from 'react';
import localStorageUtils from '../../utils/localStorageUtils';
import { ThemeType } from '../../components/assets/themes/themeDefault';
import { useThemePreferenceContext } from './ThemePreferenceContext';

const useThemePreference = () => {
  const themePreferenceContext = useThemePreferenceContext();

  const setTheme = useCallback((theme: ThemeType) => {
    localStorageUtils.saveThemePreference(theme);
    themePreferenceContext?.setThemePreference(theme);
  }, [themePreferenceContext]);

  useEffect(() => {
    const savedPreference = localStorageUtils.getThemePreference();

    const prefersLightQuery = window.matchMedia('(prefers-color-scheme: light)');
    const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    prefersLightQuery.onchange = (ev) => {
      if (ev.matches) {
        themePreferenceContext?.setThemePreference('light');
      }
    };

    prefersDarkQuery.onchange = (ev) => {
      if (ev.matches) {
        themePreferenceContext?.setThemePreference('dark');
      }
    };

    if (savedPreference) {
      themePreferenceContext?.setThemePreference(savedPreference);
    } else if (prefersLightQuery.matches) {
      themePreferenceContext?.setThemePreference('light');
    } else if (prefersDarkQuery.matches) {
      themePreferenceContext?.setThemePreference('dark');
    }

    return () => {
      prefersLightQuery.onchange = null;
      prefersDarkQuery.onchange = null;
    };
  }, [themePreferenceContext]);

  return {
    themePreference: themePreferenceContext?.themePreference ?? 'light',
    setTheme,
  };
};

export default useThemePreference;
