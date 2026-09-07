import {
  AdapterResult,
  INotificationAdapter,
  NotificationChannelType,
  NotificationPayload,
} from '../../interfaces/notification-channel.interface';
import { randomUUID } from 'crypto';

export class TwilioSmsAdapter implements INotificationAdapter {
  public readonly name = 'TwilioSms';
  public readonly channelType: NotificationChannelType = 'SMS';

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<AdapterResult> {
    // In production, invokes Twilio Messaging API
    return {
      success: true,
      messageId: `SM_${randomUUID()}`,
      statusCode: 200,
    };
  }
}
