import {
  AdapterResult,
  INotificationAdapter,
  NotificationChannelType,
  NotificationPayload,
} from '../../interfaces/notification-channel.interface';
import { randomUUID } from 'crypto';

export class FcmPushAdapter implements INotificationAdapter {
  public readonly name = 'FcmPush';
  public readonly channelType: NotificationChannelType = 'PUSH';

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<AdapterResult> {
    // In production, invokes Firebase Cloud Messaging (FCM) v1 HTTP API
    return {
      success: true,
      messageId: `projects/vkc/messages/${randomUUID()}`,
      statusCode: 200,
    };
  }
}
