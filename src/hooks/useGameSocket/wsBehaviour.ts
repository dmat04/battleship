import { AppDispatch } from '../../store/store';

const onOpenBuilder = (authCode: string, socket: WebSocket) => (event: Event) => {
  console.log('socket opened', event);
  socket.send(authCode);
};

const onMessageBuilder = (dispatch: AppDispatch) => (event: MessageEvent) => {
  console.log('message received', event.data);
  // dispatch('some/thing');
};

const onError = (event: Event) => {
  console.log('socket error', event);
};

const onCLose = (event: CloseEvent) => {
  console.log('socket closed', event.reason);
};

const createSocket = (url: string, authCode: string, dispatch: AppDispatch): WebSocket => {
  const socket = new WebSocket(url);

  socket.onopen = onOpenBuilder(authCode, socket);
  socket.onmessage = onMessageBuilder(dispatch);
  socket.onerror = onError;
  socket.onclose = onCLose;

  return socket;
};

export default createSocket;
