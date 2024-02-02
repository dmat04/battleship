import { isInteger } from 'lodash';
import { assertNever } from '../utils/typeUtils';
import { ClientMessageCode, ClientMessage, ShootMessage } from './MessageTypes';

const isShootMessage = (message: object): message is ShootMessage => {
  const typed = message as ShootMessage;

  if (!isInteger(typed.x) || !isInteger(typed.y)) {
    return false;
  }

  if (!typed.code || typed.code !== ClientMessageCode.Shoot) {
    return false;
  }

  return true;
};

const ParseMessage = (jsonMessage: string): ClientMessage | undefined => {
  let message = null;

  try {
    message = JSON.parse(jsonMessage);
  } catch {
    return undefined;
  }

  if (typeof message !== 'object') {
    return undefined;
  }

  if (!('code' in message)) {
    return undefined;
  }

  if (!Object.values(ClientMessageCode).includes(message.code)) {
    return undefined;
  }

  const code: ClientMessageCode = message.code as ClientMessageCode;

  switch (code) {
    case ClientMessageCode.Shoot: return isShootMessage(message) ? message : undefined;
    case ClientMessageCode.RoomStatusRequest: return { code };
    default: return assertNever(code);
  }
};

export default {
  ParseMessage,
};
