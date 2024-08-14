export enum WSState {
  Error = "Error",
  Unauthenticated = "Unauthenticated",
  Open = "Open",
}

export interface WSData {
  state: WSState;
  roomID: string;
  username: string;
  errorMessage?: string;
}
