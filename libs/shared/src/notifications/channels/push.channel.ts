import { BaseNotificationChannel } from './base.channel';
import { NotificationChannelType } from '../interfaces/notification-channel.interface';
import { FcmPushAdapter } from '../adapters/push/fcm.adapter';

/**
 * Low-Level Design (LLD): Enterprise Push Notification Channel
 * Chain of Responsibility: Firebase Cloud Messaging (FCM) v1.
 */
export class PushNotificationChannel extends BaseNotificationChannel {
  public readonly channelType: NotificationChannelType = 'PUSH';

  constructor() {
    super();
    this.registerAdapter(new FcmPushAdapter());
  }
}
