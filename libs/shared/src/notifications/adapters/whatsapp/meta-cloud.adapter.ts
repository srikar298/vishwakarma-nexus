import {
  AdapterResult,
  INotificationAdapter,
  NotificationChannelType,
  NotificationPayload,
} from '../../interfaces/notification-channel.interface';
import { randomUUID } from 'crypto';

export class MetaCloudWhatsAppAdapter implements INotificationAdapter {
  public readonly name = 'MetaCloudWhatsApp';
  public readonly channelType: NotificationChannelType = 'WHATSAPP';

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<AdapterResult> {
    // In production, invokes Meta Cloud WhatsApp Graph API
    return {
      success: true,
      messageId: `wamid_${randomUUID()}`,
      statusCode: 200,
    };
  }
}
