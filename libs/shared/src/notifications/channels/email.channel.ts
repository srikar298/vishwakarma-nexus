import { BaseNotificationChannel } from './base.channel';
import { NotificationChannelType } from '../interfaces/notification-channel.interface';
import { SendGridEmailAdapter } from '../adapters/email/sendgrid.adapter';
import { AwsSesEmailAdapter } from '../adapters/email/aws-ses.adapter';

/**
 * Low-Level Design (LLD): Enterprise Email Notification Channel
 * Chain of Responsibility: SendGrid Email (Primary) -> AWS SES Email (Secondary).
 */
export class EmailNotificationChannel extends BaseNotificationChannel {
  public readonly channelType: NotificationChannelType = 'EMAIL';

  constructor() {
    super();
    this.registerAdapter(new SendGridEmailAdapter());
    this.registerAdapter(new AwsSesEmailAdapter());
  }
}
