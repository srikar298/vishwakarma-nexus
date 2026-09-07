import { 
  INotificationChannel, 
  NotificationChannelType, 
  NotificationPayload, 
  NotificationResult 
} from './interfaces/notification-channel.interface';
import { WhatsAppNotificationChannel } from './channels/whatsapp.channel';
import { SMSNotificationChannel } from './channels/sms.channel';
import { PushNotificationChannel } from './channels/push.channel';
import { EmailNotificationChannel } from './channels/email.channel';
import { logger } from '../logger';

/**
 * Low-Level Design (LLD): Strategy-Driven Multi-Channel Notification Dispatcher
 * Allows unified, multi-channel dispatch with automatic channel fallback.
 */
export class NotificationDispatcher {
  private channels = new Map<NotificationChannelType, INotificationChannel>();

  constructor() {
    this.registerChannel(new WhatsAppNotificationChannel());
    this.registerChannel(new SMSNotificationChannel());
    this.registerChannel(new PushNotificationChannel());
    this.registerChannel(new EmailNotificationChannel());
  }

  public registerChannel(channel: INotificationChannel): void {
    this.channels.set(channel.channelType, channel);
  }

  public async send(
    channelType: NotificationChannelType,
    payload: NotificationPayload,
    fallbackChannel?: NotificationChannelType
  ): Promise<NotificationResult> {
    const channel = this.channels.get(channelType);

    if (!channel || !channel.isAvailable()) {
      if (fallbackChannel) {
        logger.warn(
          { primary: channelType, fallback: fallbackChannel },
          'NotificationDispatcher: Primary channel unavailable. Switching to fallback.'
        );
        return this.send(fallbackChannel, payload);
      }

      return {
        success: false,
        channel: channelType,
        error: `Notification channel [${channelType}] is not registered or available.`,
        timestamp: new Date().toISOString(),
      };
    }

    const result = await channel.send(payload);

    // If primary failed and fallback is defined, attempt fallback
    if (!result.success && fallbackChannel) {
      logger.warn(
        { primary: channelType, fallback: fallbackChannel, error: result.error },
        'NotificationDispatcher: Dispatch failed on primary channel. Attempting fallback.'
      );
      return this.send(fallbackChannel, payload);
    }

    return result;
  }
}

export const defaultNotificationDispatcher = new NotificationDispatcher();
