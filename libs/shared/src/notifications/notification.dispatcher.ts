import {
  INotificationChannel,
  NotificationChannelType,
  NotificationOptions,
  NotificationPayload,
  NotificationPriority,
  NotificationResult,
} from './interfaces/notification-channel.interface';
import { WhatsAppNotificationChannel } from './channels/whatsapp.channel';
import { SMSNotificationChannel } from './channels/sms.channel';
import { PushNotificationChannel } from './channels/push.channel';
import { EmailNotificationChannel } from './channels/email.channel';
import { TemplateEngine } from './templates/template-engine';
import { TokenBucketLimiter } from '../rate-limit/token-bucket.limiter';
import { IJobQueue, JobPriority } from '../queue/job-queue.interface';
import { defaultJobQueue } from '../queue/queue.factory';
import { PiiMasker } from '../crypto/pii-masker';
import { logger } from '../logger';

/**
 * Low-Level Design (LLD): Strategy-Driven Multi-Channel Notification Dispatcher
 * Features:
 * - Two-tier Resilience: Intra-channel Adapter Chain + Inter-channel Cascading Fallback
 * - Anti-spam token bucket rate limiting per recipient
 * - Safe template parameter interpolation (TemplateEngine)
 * - Priority-aware asynchronous job queue offloading (JobQueue)
 * - Strict PII protection in all system logs
 */
export class NotificationDispatcher {
  private channels = new Map<NotificationChannelType, INotificationChannel>();
  private antiSpamLimiter: TokenBucketLimiter;
  private jobQueue: IJobQueue;

  constructor(jobQueue: IJobQueue = defaultJobQueue) {
    this.jobQueue = jobQueue;

    // Default rate limiter: max 10 dispatches per recipient per 60 seconds
    this.antiSpamLimiter = new TokenBucketLimiter({
      capacity: 10,
      refillTokens: 10,
      refillIntervalMs: 60000, // 60 seconds
    });

    this.registerChannel(new WhatsAppNotificationChannel());
    this.registerChannel(new SMSNotificationChannel());
    this.registerChannel(new PushNotificationChannel());
    this.registerChannel(new EmailNotificationChannel());

    // Register async worker handler
    this.jobQueue.process<{
      cascade: NotificationChannelType[];
      payload: NotificationPayload;
      options?: NotificationOptions;
    }>('notification.dispatch', async (job) => {
      const { cascade, payload, options } = job.data;
      return this.sendWithCascade(cascade, payload, { ...options, async: false });
    });
  }

  public registerChannel(channel: INotificationChannel): void {
    this.channels.set(channel.channelType, channel);
  }

  public getChannel(channelType: NotificationChannelType): INotificationChannel | undefined {
    return this.channels.get(channelType);
  }

  /**
   * Dispatches a notification across a cascade of channels.
   * If every adapter in Channel 1 fails, it cascades to Channel 2, then Channel 3, etc.
   */
  public async sendWithCascade(
    channelCascade: NotificationChannelType[],
    payload: NotificationPayload,
    options: NotificationOptions = {}
  ): Promise<NotificationResult> {
    const maskedRecipient = PiiMasker.maskPhone(payload.recipient);

    // 1. Anti-Spam Rate Limiting Guard
    const limitKey = options.rateLimitKey || `notify:${payload.recipient.trim()}`;
    const rateLimitResult = await this.antiSpamLimiter.consume(limitKey, 1);

    if (!rateLimitResult.allowed) {
      logger.warn({ to: maskedRecipient, key: limitKey }, '[NotificationDispatcher] Rate limit exceeded for recipient');
      return {
        success: false,
        channel: channelCascade[0] || 'SMS',
        error: `Anti-spam rate limit exceeded for recipient ${maskedRecipient}`,
        timestamp: new Date().toISOString(),
        attemptsMade: 0,
        adaptersAttempted: [],
        channelsAttempted: [],
      };
    }

    // 2. Safe Template Interpolation
    let renderedMessage = payload.message;
    if (payload.templateParams && Object.keys(payload.templateParams).length > 0) {
      renderedMessage = TemplateEngine.render(payload.message, payload.templateParams);
    }

    const preparedPayload: NotificationPayload = {
      ...payload,
      message: renderedMessage,
    };

    // 3. Asynchronous Offloading to JobQueue
    if (options.async) {
      const priorityMap: Record<NotificationPriority, JobPriority> = {
        [NotificationPriority.URGENT]: JobPriority.CRITICAL,
        [NotificationPriority.HIGH]: JobPriority.HIGH,
        [NotificationPriority.NORMAL]: JobPriority.NORMAL,
        [NotificationPriority.LOW]: JobPriority.LOW,
      };

      const jobPriority = options.priority ? priorityMap[options.priority] : JobPriority.NORMAL;

      const jobId = await this.jobQueue.addJob(
        'notification.dispatch',
        { cascade: channelCascade, payload: preparedPayload, options },
        { priority: jobPriority }
      );

      logger.info({ jobId, to: maskedRecipient, channels: channelCascade }, '[NotificationDispatcher] Offloaded notification to JobQueue');

      return {
        success: true,
        channel: channelCascade[0] || 'SMS',
        messageId: jobId,
        timestamp: new Date().toISOString(),
        attemptsMade: 1,
        adaptersAttempted: ['JobQueue'],
        channelsAttempted: channelCascade,
      };
    }

    // 4. Inter-Channel Cascading Fallback Execution
    const channelsAttempted: NotificationChannelType[] = [];
    const allAdaptersAttempted: string[] = [];
    let totalAttempts = 0;
    let lastError: string | undefined;

    for (const channelType of channelCascade) {
      channelsAttempted.push(channelType);
      const channel = this.channels.get(channelType);

      if (!channel || !channel.isAvailable()) {
        logger.warn({ channel: channelType, to: maskedRecipient }, `[NotificationDispatcher] Channel [${channelType}] unavailable, cascading to next`);
        continue;
      }

      // Execute Channel (which runs its own Chain of Responsibility across adapters)
      const result = await channel.send(preparedPayload, options);
      totalAttempts += result.attemptsMade;
      allAdaptersAttempted.push(...result.adaptersAttempted);

      if (result.success) {
        // TASK: [Audit Integration] Log successful notification delivery
        return {
          ...result,
          attemptsMade: totalAttempts,
          adaptersAttempted: allAdaptersAttempted,
          channelsAttempted,
        };
      }

      lastError = result.error;
      logger.warn({
        failedChannel: channelType,
        to: maskedRecipient,
        error: lastError,
      }, `[NotificationDispatcher] All adapters in channel [${channelType}] failed. Cascading to next channel in cascade list.`);
    }

    // Every channel and every adapter failed
    // TASK: [Audit Integration] Log notification exhaustion alert to Audit Logger
    return {
      success: false,
      channel: channelCascade[0] || 'SMS',
      error: `Notification delivery exhausted across all channels [${channelCascade.join(', ')}]: ${lastError}`,
      timestamp: new Date().toISOString(),
      attemptsMade: totalAttempts,
      adaptersAttempted: allAdaptersAttempted,
      channelsAttempted,
    };
  }

  /**
   * Backward-compatible convenience dispatch method
   */
  public async send(
    channelType: NotificationChannelType,
    payload: NotificationPayload,
    fallbackChannel?: NotificationChannelType,
    options?: NotificationOptions
  ): Promise<NotificationResult> {
    const cascade = fallbackChannel ? [channelType, fallbackChannel] : [channelType];
    return this.sendWithCascade(cascade, payload, options);
  }
}

export const defaultNotificationDispatcher = new NotificationDispatcher();
