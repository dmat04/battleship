import { useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import { useCheckUsernameLazyQuery } from "../graphql/__generated__/operationHooks.js";
import { UserKind } from "@battleship/common/types/__generated__/types.generated.js";

const useUsernameChecker = (
  emptyStateMessage: string,
  usernameValidMessage: string,
  usernameTakenMessage: string,
  userKind: UserKind,
) => {
  const [username, setUsername] = useState<string>("");
  const [checkIsPending, setCheckIsPending] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(emptyStateMessage);
  const [isValid, setIsValid] = useState<boolean>(false);

  const [checkUsername, { data, loading }] = useCheckUsernameLazyQuery({
    fetchPolicy: "no-cache",
  });

  const requestSender = useRef<(() => void) | null>(() => {
    void checkUsername({ variables: { username, userKind } });
  });

  useEffect(() => {
    requestSender.current = () => void checkUsername({ variables: { username, userKind } });
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
