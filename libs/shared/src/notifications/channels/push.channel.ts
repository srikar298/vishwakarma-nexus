import { 
  INotificationChannel, 
  NotificationChannelType, 
  NotificationPayload, 
  NotificationResult 
} from '../interfaces/notification-channel.interface';
import { logger } from '../../logger';
import { nanoid } from 'nanoid';

export class PushNotificationChannel implements INotificationChannel {
  public readonly channelType: NotificationChannelType = 'PUSH';

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      logger.info(
        { channel: this.channelType, to: payload.recipient, title: payload.title },
        `[Push Gateway] Dispatching Push notification to token: ${payload.recipient}`
      );

      return {
        success: true,
        channel: this.channelType,
        messageId: `push_${nanoid()}`,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.error({ channel: this.channelType, error: err.message }, 'Push dispatch failed');
      return {
        success: false,
        channel: this.channelType,
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
