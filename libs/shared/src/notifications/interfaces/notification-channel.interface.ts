/**
 * Low-Level Design (LLD): Comprehensive Multi-Channel Notification Interfaces
 * 
 * Supports:
 * - Multi-Channel notification types (WhatsApp, SMS, Push, Email)
 * - Chain of Responsibility adapter contracts
 * - Cascading fallback telemetry and attempt history
 * - Anti-spam rate limiting and asynchronous priority queuing
 */

export type NotificationChannelType = 'WHATSAPP' | 'SMS' | 'PUSH' | 'EMAIL';

export enum NotificationPriority {
  URGENT = 1, // OTPs, Security alerts
  HIGH = 2,   // Transactional receipts, booking confirmations
  NORMAL = 3, // Community updates, match recommendations
  LOW = 4,    // Newsletters, bulk promotions
}

export interface NotificationPayload {
  recipient: string; // Phone number (+91...), email address, or device push token
  title?: string;
  message: string;
  templateId?: string;
  templateParams?: Record<string, string | number>;
  metadata?: Record<string, any>;
}

export interface AdapterResult {
  success: boolean;
  messageId?: string;
  error?: string;
  statusCode?: number;
  durationMs?: number;
}

export interface NotificationResult {
  success: boolean;
  channel: NotificationChannelType;
  adapterName?: string;
  messageId?: string;
  error?: string;
  timestamp: string;
  attemptsMade: number;
  adaptersAttempted: string[];
  channelsAttempted: NotificationChannelType[];
}

export interface NotificationOptions {
  priority?: NotificationPriority;
  rateLimitKey?: string;
  maxAttemptsPerAdapter?: number;
  timeoutMs?: number;
  async?: boolean;
}

/**
 * Adapter Contract: Individual vendor integration (e.g. Gupshup, Msg91, SendGrid)
 */
export interface INotificationAdapter {
  readonly name: string;
  readonly channelType: NotificationChannelType;
  isAvailable(): boolean;
  send(payload: NotificationPayload): Promise<AdapterResult>;
}

/**
 * Channel Contract: Orchestrates the Chain of Responsibility across vendor adapters
 */
export interface INotificationChannel {
  readonly channelType: NotificationChannelType;
  registerAdapter(adapter: INotificationAdapter): void;
  getAdapters(): INotificationAdapter[];
  isAvailable(): boolean;
  send(payload: NotificationPayload, options?: NotificationOptions): Promise<NotificationResult>;
}
