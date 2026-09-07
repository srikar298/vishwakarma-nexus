import { 
  INotificationChannel, 
  NotificationChannelType, 
  NotificationPayload, 
  NotificationResult 
} from '../interfaces/notification-channel.interface';
import { logger } from '../../logger';
import { nanoid } from 'nanoid';

export class EmailNotificationChannel implements INotificationChannel {
  public readonly channelType: NotificationChannelType = 'EMAIL';

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      logger.info(
        { channel: this.channelType, to: payload.recipient, subject: payload.title },
        `[Email Gateway] Dispatching Email to ${payload.recipient}`
      );

      return {
        success: true,
        channel: this.channelType,
        messageId: `email_${nanoid()}`,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.error({ channel: this.channelType, error: err.message }, 'Email dispatch failed');
      return {
        success: false,
        channel: this.channelType,
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
