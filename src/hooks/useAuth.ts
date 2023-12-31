import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '../store/store';
import { REGISTERED_LOGIN } from '../graphql/mutations';
import { LoginResult } from '../types/ServerTypes';
import { clearAuth, setAuth } from '../store/authSlice';
import LocalStorage from '../utils/localStorageUtils';

const useAuth = () => {
  const token = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [doLogin, { loading }] = useMutation(
    REGISTERED_LOGIN,
    { fetchPolicy: 'no-cache' },
  );
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string): Promise<void> => {
    const response = await doLogin({ variables: { username, password } });

    if (response.data.registeredLogin !== null) {
      const newToken = response.data.registeredLogin as LoginResult;
      LocalStorage.saveAccessToken(newToken);
      setError(null);
      dispatch(setAuth(newToken));
    }

    if (response.errors) {
      setError('Login unsuccessfull');
    }
  };

  const logout = (): void => {
    LocalStorage.clearAccessToken();
    dispatch(clearAuth());
  };

  return [token, login, logout, loading, error] as const;
};

export default useAuth;
