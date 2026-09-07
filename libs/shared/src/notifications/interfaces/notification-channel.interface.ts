export type NotificationChannelType = 'WHATSAPP' | 'SMS' | 'PUSH' | 'EMAIL';

export interface NotificationPayload {
  recipient: string;          // Phone number, email, or device token
  title?: string;
  message: string;
  templateId?: string;
  templateParams?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface NotificationResult {
  success: boolean;
  channel: NotificationChannelType;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export interface INotificationChannel {
  readonly channelType: NotificationChannelType;
  isAvailable(): boolean;
  send(payload: NotificationPayload): Promise<NotificationResult>;
}
