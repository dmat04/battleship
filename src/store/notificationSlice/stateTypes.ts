import { Interface } from "readline";

export enum NotificationType {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  timeoutID: number | null;
  dismissible: boolean;
}

export interface SliceState {
  notifications: Notification[];
}

export interface NotificationArgs {
  message: string;
  timeout?: number;
  dismissible?: boolean;
}
