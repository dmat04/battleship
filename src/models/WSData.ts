export enum WSState {
  Error = 'Error',
  Unauthenticated = 'Unauthenticated',
  Open = 'Open',
}

export interface WSData {
  state: WSState;
  roomID: string;
  roomIsActive: boolean;
  username: string;
  errorMessage?: string;
}
