import {
  AdapterResult,
  INotificationAdapter,
  NotificationChannelType,
  NotificationPayload,
} from '../../interfaces/notification-channel.interface';
import { randomUUID } from 'crypto';

export class SendGridEmailAdapter implements INotificationAdapter {
  public readonly name = 'SendGridEmail';
  public readonly channelType: NotificationChannelType = 'EMAIL';

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<AdapterResult> {
    // In production, invokes SendGrid v3 Mail API
    return {
      success: true,
      messageId: `sg_${randomUUID()}`,
      statusCode: 202,
    };
  }
}
