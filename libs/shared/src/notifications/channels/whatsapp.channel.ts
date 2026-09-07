import { BaseNotificationChannel } from './base.channel';
import { NotificationChannelType } from '../interfaces/notification-channel.interface';
import { GupshupWhatsAppAdapter } from '../adapters/whatsapp/gupshup.adapter';
import { MetaCloudWhatsAppAdapter } from '../adapters/whatsapp/meta-cloud.adapter';

/**
 * Low-Level Design (LLD): Enterprise WhatsApp Notification Channel
 * Chain of Responsibility: Gupshup WhatsApp (Primary) -> Meta Cloud API WhatsApp (Secondary).
 */
export class WhatsAppNotificationChannel extends BaseNotificationChannel {
  public readonly channelType: NotificationChannelType = 'WHATSAPP';

  constructor() {
    super();
    // Default Chain of Responsibility
    this.registerAdapter(new GupshupWhatsAppAdapter());
    this.registerAdapter(new MetaCloudWhatsAppAdapter());
  }
}
