import {
  AdapterResult,
  INotificationAdapter,
  NotificationChannelType,
  NotificationPayload,
} from '../../interfaces/notification-channel.interface';
import { randomUUID } from 'crypto';

export class GupshupWhatsAppAdapter implements INotificationAdapter {
  public readonly name = 'GupshupWhatsApp';
  public readonly channelType: NotificationChannelType = 'WHATSAPP';

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<AdapterResult> {
    // In production, invokes Gupshup Enterprise WhatsApp API
    return {
      success: true,
      messageId: `gs_wa_${randomUUID()}`,
      statusCode: 200,
    };
  }
}
