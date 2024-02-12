import { createAction } from '@reduxjs/toolkit';
import type { ClientMessage, ServerMessage } from './messageTypes';

export interface WSConnectionArgs {
  roomID: string,
  wsAuthCode: string,
}

export const openWSConnection = createAction<WSConnectionArgs>('ws/connect');

export const closeWSConnection = createAction('ws/disconnect');

export const sendMessage = createAction<ClientMessage>('ws/sendMessage');

export const messageReceived = createAction<ServerMessage>('ws/messageReceived');
