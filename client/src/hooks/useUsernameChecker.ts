import { useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import { useLazyQuery } from "@apollo/client";
import { CHECK_USERNAME } from "../graphql/queries";

const useUsernameChecker = (
  emptyStateMessage: string,
  usernameValidMessage: string,
  usernameTakenMessage: string,
) => {
  const [username, setUsername] = useState<string>("");
  const [checkIsPending, setCheckIsPending] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(emptyStateMessage);
  const [isValid, setIsValid] = useState<boolean>(false);

  const [checkUsername, { data, loading }] = useLazyQuery(CHECK_USERNAME, {
    fetchPolicy: "no-cache",
  });

  const requestSender = useRef<(() => void) | null>(() => {
    checkUsername({ variables: { username } });
  });

  useEffect(() => {
    requestSender.current = () => checkUsername({ variables: { username } });
  }, [checkUsername, username]);

  const debouncedRequestSender = useMemo(() => {
    const fn = () => {
      requestSender.current?.();
    };

    return _.debounce(fn, 500);
  }, []);

  const setUsernameExternal = (value: string) => {
    setUsername(value);
    if (value.length > 0) {
      setCheckIsPending(true);
      debouncedRequestSender();
    }
  };

  useEffect(() => {
    if (loading === false) {
      setCheckIsPending(false);
      setIsValid(
        !data?.checkUsername.taken && !data?.checkUsername.validationError,
      );
    }
  }, [loading, data]);

  useEffect(() => {
    if (username.length === 0) {
      setMessage(emptyStateMessage);
    } else if (data?.checkUsername?.taken) {
      setMessage(usernameTakenMessage);
    } else if (data?.checkUsername.validationError) {
      setMessage(data.checkUsername.validationError);
    } else if (!loading) {
      setMessage(usernameValidMessage);
    }
  }, [
    data,
    loading,
    username,
    emptyStateMessage,
    usernameTakenMessage,
    usernameValidMessage,
  ]);

  return {
    username,
    setUsername: setUsernameExternal,
    checkIsPending,
    message,
    isValid,
  };
};

export default useUsernameChecker;
