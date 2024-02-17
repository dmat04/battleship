export enum NotificationType {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
}

export interface TransientData {
  timeoutID: ReturnType<typeof setTimeout>;
  expiresAt: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  transientInfo?: TransientData;
}

export interface SliceState {
  notifications: Notification[];
}

export type PermanentNotificationArgs = Omit<Notification, 'id' | 'transientInfo'>;
export type TransientNotificationArgs = PermanentNotificationArgs & { timeoutArg: number };
