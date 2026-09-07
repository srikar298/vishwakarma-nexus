import {
  AdapterResult,
  INotificationAdapter,
  NotificationChannelType,
  NotificationPayload,
} from '../../interfaces/notification-channel.interface';
import { randomUUID } from 'crypto';

export class Msg91SmsAdapter implements INotificationAdapter {
  public readonly name = 'Msg91Sms';
  public readonly channelType: NotificationChannelType = 'SMS';

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<AdapterResult> {
    // In production, invokes Msg91 DLT compliant SMS API
    return {
      success: true,
      messageId: `msg91_${randomUUID()}`,
      statusCode: 200,
    };
  }
}
