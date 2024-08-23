import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { Helmet } from "react-helmet";
import themeDefault, { ThemeType } from "../assets/themes/themeDefault.js";
import themeDark from "../assets/themes/themeDark.js";
import {
  ThemePreference,
  ThemePreferenceContext,
} from "./ThemePreferenceContext.js";
import localStorageUtils from "../../utils/localStorageUtils.js";

type MediaQueryResult = MediaQueryList | MediaQueryListEvent;

const prefersLightQuery = window.matchMedia("(prefers-color-scheme: light)");
const prefersDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");

const initialSystemTheme: ThemeType = prefersDarkQuery.matches
  ? "dark"
  : "light";
const initialUserPreference: ThemePreference =
  localStorageUtils.getThemePreference() ?? "system";
const initialTheme: ThemeType =
  initialUserPreference !== "system"
    ? initialUserPreference
    : initialSystemTheme;

const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const [systemPreference, setSystemPreference] =
    useState<ThemeType>(initialSystemTheme);
  const [userPreference, setUserPreference] = useState<ThemePreference>(
    initialUserPreference,
  );
  const [theme, setTheme] = useState<ThemeType>(initialTheme);

  const prefersLightQueryChanged = useCallback(
    ({ matches }: MediaQueryResult) => {
      if (matches) {
        setSystemPreference("light");

        if (userPreference === "system") {
          setTheme("light");
        }
      }
    },
    [userPreference],
  );

  const prefersDarkQueryChanged = useCallback(
    ({ matches }: MediaQueryResult) => {
      if (matches) {
        setSystemPreference("dark");

        if (userPreference === "system") {
          setTheme("dark");
        }
      }
    },
    [userPreference],
  );

  useLayoutEffect(() => {
    prefersLightQuery.onchange = prefersLightQueryChanged;
    prefersDarkQuery.onchange = prefersDarkQueryChanged;

    prefersLightQueryChanged(prefersLightQuery);
    prefersDarkQueryChanged(prefersDarkQuery);

    return () => {
      prefersLightQuery.onchange = null;
      prefersDarkQuery.onchange = null;
    };
  }, [prefersDarkQueryChanged, prefersLightQueryChanged]);

  const handleUserPreferenceChange = useCallback(
    (newTheme: ThemePreference) => {
      localStorageUtils.saveThemePreference(newTheme);
      setUserPreference(newTheme);

      if (newTheme === "system") {
        setTheme(systemPreference);
      } else {
        setTheme(newTheme);
      }
    },
    [systemPreference],
  );

  const themePreferenceContextValue = useMemo(
    () => ({
      theme,
      userPreference,
      setUserPreference: handleUserPreferenceChange,
    }),
    [theme, userPreference, handleUserPreferenceChange],
  );

  const themeObject = useMemo(() => {
    switch (theme) {
      case "dark":
        return themeDark;
      default:
        return themeDefault;
    }
  }, [theme]);

  return (
    <ThemePreferenceContext.Provider value={themePreferenceContextValue}>
      <StyledComponentsThemeProvider theme={themeObject}>
        <Helmet>
          <meta name="theme-color" content={themeObject.colors.surfaceTertiary}/>
          <meta name="color-scheme" content={theme}/>
        </Helmet>
        {children}
      </StyledComponentsThemeProvider>
    </ThemePreferenceContext.Provider>
  );
};

export default ThemeProvider;
