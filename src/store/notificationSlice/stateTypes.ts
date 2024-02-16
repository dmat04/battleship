export enum NotificationType {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  expiresAt?: number
}

export interface SliceState {
  notifications: Notification[];
}

export type PermanentNotificationArgs = Omit<Notification, 'id' | 'expiresAt'>;
export type TransientNotificationArgs = PermanentNotificationArgs & { timeoutArg: number };
