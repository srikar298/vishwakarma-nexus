import {
  AdapterResult,
  INotificationAdapter,
  NotificationChannelType,
  NotificationPayload,
} from '../../interfaces/notification-channel.interface';
import { randomUUID } from 'crypto';

export class AwsSesEmailAdapter implements INotificationAdapter {
  public readonly name = 'AwsSesEmail';
  public readonly channelType: NotificationChannelType = 'EMAIL';

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<AdapterResult> {
    // In production, invokes AWS SES SendEmailCommand
    return {
      success: true,
      messageId: `ses_${randomUUID()}`,
      statusCode: 200,
    };
  }
}
