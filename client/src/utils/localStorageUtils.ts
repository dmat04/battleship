import { LoginResult } from '../__generated__/graphql';
import { ThemePreference } from '../components/ThemeProvider/ThemePreferenceContext';
import { isInteger, isString } from './typeUtils';

const KEY_AUTH_TOKEN = 'KEY_AUTH_TOKEN';
const KEY_THEME = 'KEY_THEME';
const KEY_GAME_HINTS_SEEN = 'KEY_GAME_HINTS_SEEN';

const saveAccessToken = (loginResult: LoginResult): boolean => {
  try {
    const value = JSON.stringify(loginResult);
    localStorage.setItem(KEY_AUTH_TOKEN, value);
    return true;
  } catch {
    return false;
  }
};

const getAccessToken = (): LoginResult | null => {
  const value = localStorage.getItem(KEY_AUTH_TOKEN);
  if (value === null) return null;

  let parsed = null;
  try {
    parsed = JSON.parse(value);
  } catch {
    localStorage.removeItem(KEY_AUTH_TOKEN);
    return null;
  }

  if ('username' in parsed && isString(parsed.username)
    && 'accessToken' in parsed && isString(parsed.accessToken)
    && 'expiresAt' in parsed && isInteger(parsed.expiresAt)
  ) {
    const expiresAt = Number.parseInt(parsed.expiresAt, 10);
    const now = Date.now();
    const left = expiresAt - now;

    // only return the token if it's alive for atleast an hour
    if (left >= 3_600_000) {
      return parsed;
    }
  }

  localStorage.removeItem(KEY_AUTH_TOKEN);
  return null;
};

const clearAccessToken = (): void => {
  localStorage.removeItem(KEY_AUTH_TOKEN);
};

const saveThemePreference = (theme: ThemePreference) => {
  localStorage.setItem(KEY_THEME, theme);
};

const getThemePreference = (): ThemePreference | undefined => {
  const value = localStorage.getItem(KEY_THEME);
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }

  return undefined;
};

const hasSeenGameHints = (): boolean => localStorage.getItem(KEY_GAME_HINTS_SEEN) !== null;

const setGameHintsSeen = () => localStorage.setItem(KEY_GAME_HINTS_SEEN, 'true');

export default {
  saveAccessToken,
  getAccessToken,
  clearAccessToken,
  saveThemePreference,
  getThemePreference,
  hasSeenGameHints,
  setGameHintsSeen,
};
