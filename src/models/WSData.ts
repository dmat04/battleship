import { WebSocket } from 'uWebSockets.js';

export enum WSState {
  Error = 'Error',
  Unauthenticated = 'Unauthenticated',
  Open = 'Open',
}

export interface WSData {
  state: WSState;
  gameID: string;
  username: string;
  opponentWS: WebSocket<WSData> | null;
  errorMessage?: string;
}
