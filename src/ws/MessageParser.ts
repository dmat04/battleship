import { isInteger } from 'lodash';
import { assertNever } from '../utils/typeUtils';
import { CoordinateMessage, IncomingMessageCode, IncommingMessage } from './MessageTypes';

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

const ParseMessage = (jsonMessage: string): IncommingMessage | undefined => {
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

  if (!Object.values(IncomingMessageCode).includes(message.code)) {
    return undefined;
  }

  const code: IncomingMessageCode = message.code as IncomingMessageCode;

  switch (code) {
    case IncomingMessageCode.Shoot: {
      const coordinates = parseCoordinateMessage(message);
      if (coordinates) {
        return {
          ...coordinates,
          code,
        };
      }
      return undefined;
    }
    case IncomingMessageCode.RoomStatusRequest: return { code };
    default: return assertNever(code);
  }
};

export default {
  ParseMessage,
};
