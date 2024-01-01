import { LoginResult } from '../__generated__/graphql';
import { isString } from './typeUtils';

const KEY_AUTH_TOKEN = 'KEY_AUTH_TOKEN';

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
    && 'expiresAt' in parsed && isString(parsed.accessToken)
  ) {
    return parsed;
  }

  localStorage.removeItem(KEY_AUTH_TOKEN);
  return null;
};

const clearAccessToken = (): void => {
  localStorage.removeItem(KEY_AUTH_TOKEN);
};

export default {
  saveAccessToken,
  getAccessToken,
  clearAccessToken,
};
