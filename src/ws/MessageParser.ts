import { isInteger } from 'lodash';
import {
  CoordinateMessage, ErrorMessage, GameStartedMessage, Message, MessageCode,
} from './MessageTypes';
import { assertNever, isString } from '../utils/typeUtils';

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

const parseGameStartedMessage = (message: any): GameStartedMessage | undefined => {
  if ('playsFirst' in message && isString(message.playsFirst)) {
    return {
      playsFirst: message.playsFirst,
      code: MessageCode.GameStarted,
    };
  }

  return undefined;
};

const ParseMessage = (jsonMessage: string): Message | undefined => {
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

  if (!Object.values(MessageCode).includes(message.code)) {
    return undefined;
  }

  const code: MessageCode = message.code as MessageCode;

  switch (code) {
    case MessageCode.Shoot:
    case MessageCode.Hit:
    case MessageCode.Miss: {
      const coordinates = parseCoordinateMessage(message);
      if (coordinates) {
        return {
          ...coordinates,
          code,
        };
      }
      return undefined;
    }

    case MessageCode.WaitingForOpponent:
    case MessageCode.OpponentConnected:
    case MessageCode.OpponentReady: return { code };

    case MessageCode.Error: return parseErrorMessage(message);
    case MessageCode.GameStarted: return parseGameStartedMessage(message);

    default: return assertNever(code);
  }
};

export default {
  ParseMessage,
};
