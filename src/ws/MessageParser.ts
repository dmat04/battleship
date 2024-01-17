import { isInteger } from 'lodash';
import { assertNever } from '../utils/typeUtils';
import { CoordinateMessage, ClientMessageCode, ClientMessage } from './MessageTypes';

const parseCoordinateMessage = (message: any): CoordinateMessage | undefined => {
  if ('x' in message
    && isInteger(message.x)
    && 'y' in message
    && isInteger(message.y)) {
    return {
      x: message.x,
      y: message.y,
    };
  }

  return undefined;
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
    case ClientMessageCode.Shoot: {
      const coordinates = parseCoordinateMessage(message);
      if (coordinates) {
        return {
          ...coordinates,
          code,
        };
      }
      return undefined;
    }
    case ClientMessageCode.RoomStatusRequest: return { code };
    default: return assertNever(code);
  }
};

export default {
  ParseMessage,
};
