import { useEffect, useRef } from 'react';
import { AppDispatch } from '../../store/store';
import createSocket from './wsBehaviour';

const useGameSocket = (
  username: string | undefined,
  roomID: string | undefined,
  authCode: string | undefined,
  dispatch: AppDispatch,
) => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!username || !roomID || !authCode || socket.current) return () => {};

    const uriEncodedUsername = encodeURIComponent(username);
    const url = `ws://localhost:5000/game/${roomID}/${uriEncodedUsername}`;
    socket.current = createSocket(url, authCode, dispatch);

    return () => {
      socket.current?.close();
      socket.current = null;
    };
  }, [username, roomID, authCode, dispatch]);

  return socket;
};

export default useGameSocket;
