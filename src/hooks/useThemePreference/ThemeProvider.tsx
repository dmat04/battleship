import { useMemo, useState } from 'react';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import themeDefault, { ThemeType } from '../../components/assets/themes/themeDefault';
import themeDark from '../../components/assets/themes/themeDark';
import ThemePreferenceProvider from './ThemePreferenceContext';
import { assertNever } from '../../utils/typeUtils';

const ThemeProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [themePreference, setThemePreference] = useState<ThemeType>('light');

  const themePreferenceContextValue = useMemo(() => ({
    themePreference,
    setThemePreference,
  }), [themePreference, setThemePreference]);

  let theme = themeDefault;
  switch (themePreference) {
    case 'light': break;
    case 'dark': theme = themeDark; break;
    default: assertNever(themePreference);
  }

  return (
    <ThemePreferenceProvider value={themePreferenceContextValue}>
      <StyledComponentsThemeProvider theme={theme}>
        {children}
      </StyledComponentsThemeProvider>
    </ThemePreferenceProvider>
  );
};

export default ThemeProvider;
