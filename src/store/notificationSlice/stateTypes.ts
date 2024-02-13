export enum NotificationType {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

export interface SliceState {
  notifications: Notification[];
}

export type NotificationArgs = Omit<Notification, 'id'> & { timeoutMs?: number };
