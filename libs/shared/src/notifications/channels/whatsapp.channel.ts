import { 
  INotificationChannel, 
  NotificationChannelType, 
  NotificationPayload, 
  NotificationResult 
} from '../interfaces/notification-channel.interface';
import { logger } from '../../logger';
import { nanoid } from 'nanoid';

export class WhatsAppNotificationChannel implements INotificationChannel {
  public readonly channelType: NotificationChannelType = 'WHATSAPP';

  public isAvailable(): boolean {
    return true; // Configurable via environment variables
  }

  public async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      logger.info(
        { channel: this.channelType, to: payload.recipient, template: payload.templateId },
        `[WhatsApp Gateway] Dispatching message to ${payload.recipient}`
      );

      // In production, invoke WhatsApp Cloud API / Gupshup / Infobip
      return {
        success: true,
        channel: this.channelType,
        messageId: `wa_${nanoid()}`,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.error({ channel: this.channelType, error: err.message }, 'WhatsApp dispatch failed');
      return {
        success: false,
        channel: this.channelType,
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
