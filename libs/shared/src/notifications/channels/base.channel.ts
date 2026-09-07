import {
  AdapterResult,
  INotificationAdapter,
  INotificationChannel,
  NotificationChannelType,
  NotificationOptions,
  NotificationPayload,
  NotificationResult,
} from '../interfaces/notification-channel.interface';
import { PiiMasker } from '../../crypto/pii-masker';
import { logger } from '../../logger';

/**
 * Low-Level Design (LLD): Base Notification Channel
 * Implements the Chain of Responsibility Pattern across registered vendor adapters.
 * If Adapter 1 fails or is degraded, it seamlessly falls through to Adapter 2, 3, etc.
 */
export abstract class BaseNotificationChannel implements INotificationChannel {
  public abstract readonly channelType: NotificationChannelType;
  protected adapters: INotificationAdapter[] = [];

  public registerAdapter(adapter: INotificationAdapter): void {
    if (adapter.channelType !== this.channelType) {
      throw new Error(
        `[${this.channelType}] Cannot register adapter "${adapter.name}" with mismatched channelType "${adapter.channelType}"`
      );
    }
    this.adapters.push(adapter);
  }

  public getAdapters(): INotificationAdapter[] {
    return [...this.adapters];
  }

  public isAvailable(): boolean {
    return this.adapters.some((adapter) => adapter.isAvailable());
  }

  public async send(payload: NotificationPayload, options: NotificationOptions = {}): Promise<NotificationResult> {
    const maskedRecipient = this.channelType === 'EMAIL'
      ? PiiMasker.maskEmail(payload.recipient)
      : PiiMasker.maskPhone(payload.recipient);

    const adaptersAttempted: string[] = [];
    let lastError: string | undefined;
    let attemptsCount = 0;

    const availableAdapters = this.adapters.filter((a) => a.isAvailable());

    if (availableAdapters.length === 0) {
      const errorMsg = `No active adapters available for channel [${this.channelType}]`;
      logger.warn({ channel: this.channelType, to: maskedRecipient }, errorMsg);
      return {
        success: false,
        channel: this.channelType,
        error: errorMsg,
        timestamp: new Date().toISOString(),
        attemptsMade: 0,
        adaptersAttempted: [],
        channelsAttempted: [this.channelType],
      };
    }

    // Chain of Responsibility: Iterate through registered vendor adapters
    for (const adapter of availableAdapters) {
      attemptsCount++;
      adaptersAttempted.push(adapter.name);

      const startTime = Date.now();
      logger.info({
        channel: this.channelType,
        adapter: adapter.name,
        to: maskedRecipient,
        attempt: attemptsCount,
      }, `[${this.channelType}] Attempting delivery via adapter "${adapter.name}"`);

      try {
        // TASK: [Resilience Integration] Optionally wrap adapter execution in ResiliencePipeline (Timeout + CircuitBreaker)
        const result: AdapterResult = await adapter.send(payload);
        const duration = Date.now() - startTime;

        if (result.success) {
          logger.info({
            channel: this.channelType,
            adapter: adapter.name,
            to: maskedRecipient,
            durationMs: duration,
            messageId: result.messageId,
          }, `[${this.channelType}] Notification delivered successfully via "${adapter.name}"`);

          return {
            success: true,
            channel: this.channelType,
            adapterName: adapter.name,
            messageId: result.messageId,
            timestamp: new Date().toISOString(),
            attemptsMade: attemptsCount,
            adaptersAttempted,
            channelsAttempted: [this.channelType],
          };
        }

        // Adapter returned failure: Record error and proceed to next adapter in chain
        lastError = result.error || 'Unknown provider error';
        logger.warn({
          channel: this.channelType,
          adapter: adapter.name,
          to: maskedRecipient,
          error: lastError,
        }, `[${this.channelType}] Adapter "${adapter.name}" failed. Falling through to next adapter in chain.`);
      } catch (err: any) {
        lastError = err?.message || 'Adapter execution exception';
        logger.error({
          channel: this.channelType,
          adapter: adapter.name,
          to: maskedRecipient,
          error: lastError,
        }, `[${this.channelType}] Adapter "${adapter.name}" threw exception`);
      }
    }

    // All adapters in this channel failed
    return {
      success: false,
      channel: this.channelType,
      error: `All adapters failed for channel [${this.channelType}]: ${lastError}`,
      timestamp: new Date().toISOString(),
      attemptsMade: attemptsCount,
      adaptersAttempted,
      channelsAttempted: [this.channelType],
    };
  }
}
