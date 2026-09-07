import { BaseNotificationChannel } from './base.channel';
import { NotificationChannelType } from '../interfaces/notification-channel.interface';
import { Msg91SmsAdapter } from '../adapters/sms/msg91.adapter';
import { TwilioSmsAdapter } from '../adapters/sms/twilio.adapter';

/**
 * Low-Level Design (LLD): Enterprise SMS Notification Channel
 * Chain of Responsibility: Msg91 SMS (Primary DLT) -> Twilio SMS (Secondary Fallback).
 */
export class SMSNotificationChannel extends BaseNotificationChannel {
  public readonly channelType: NotificationChannelType = 'SMS';

  constructor() {
    super();
    // Default Chain of Responsibility
    this.registerAdapter(new Msg91SmsAdapter());
    this.registerAdapter(new TwilioSmsAdapter());
  }
}
