import { 
  INotificationChannel, 
  NotificationChannelType, 
  NotificationPayload, 
  NotificationResult 
} from '../interfaces/notification-channel.interface';
import { logger } from '../../logger';
import { nanoid } from 'nanoid';

export class SMSNotificationChannel implements INotificationChannel {
  public readonly channelType: NotificationChannelType = 'SMS';

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      logger.info(
        { channel: this.channelType, to: payload.recipient },
        `[SMS Gateway] Dispatching SMS to ${payload.recipient}`
      );

      return {
        success: true,
        channel: this.channelType,
        messageId: `sms_${nanoid()}`,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.error({ channel: this.channelType, error: err.message }, 'SMS dispatch failed');
      return {
        success: false,
        channel: this.channelType,
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
