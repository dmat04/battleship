import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from '../store/store';
import { checkUsername } from '../store/authSlice';

const useUsernameChecker = () => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>('');
  const [checkIsPending, setCheckIsPending] = useState<boolean>(false);

  const requestResult = useAppSelector(({ auth }) => auth.checkUsernameResult);
  const requestSender = useRef<(() => void) | null>(() => dispatch(checkUsername(username)));

  useEffect(() => {
    if (requestResult !== null) setCheckIsPending(false);
  }, [requestResult]);

  useEffect(() => {
    if (username.length > 0) {
      requestSender.current = () => dispatch(checkUsername(username));
    } else {
      requestSender.current = null;
    }
  }, [username, dispatch]);

  const debouncedRequestSender = useMemo(() => {
    const fn = () => {
      requestSender.current?.();
    };

    return _.debounce(fn, 500);
  }, []);

  const setUsernameExternal = (value: string) => {
    if (value.length > 0 && !checkIsPending) setCheckIsPending(true);
    if (value.length === 0) setCheckIsPending(false);
    setUsername(value);
    debouncedRequestSender();
  };

  return {
    username,
    setUsername: setUsernameExternal,
    checkIsPending,
    taken: Boolean(requestResult?.taken),
    error: requestResult?.validationError ?? null,
  };
};

export default useUsernameChecker;
