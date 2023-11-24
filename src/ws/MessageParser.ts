import { isInteger } from 'lodash';
import {
  BaseMessage, CoordinateMessage, ErrorMessage, MessageCode,
} from './MessageTypes';
import { isString } from '../utils/typeUtils';

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

const parseErrorMessage = (message: any): ErrorMessage | undefined => {
  if ('message' in message && isString(message.message)) {
    return {
      message: message.message,
      code: MessageCode.Error,
    };
  }

  return undefined;
};

const ParseMessage = (jsonMessage: string): BaseMessage | undefined => {
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

  switch (message.code as MessageCode) {
    case MessageCode.Shoot:
    case MessageCode.Hit:
    case MessageCode.Miss: {
      const coordinates = parseCoordinateMessage(message);
      if (coordinates) {
        return {
          ...coordinates,
          code: message.code,
        };
      }
      return undefined;
    }
    case MessageCode.Error: return parseErrorMessage(message);
    default: return undefined;
  }
};

export default {
  ParseMessage,
};
