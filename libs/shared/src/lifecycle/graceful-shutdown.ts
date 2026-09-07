import { logger } from '../logger';

export type ShutdownHook = () => Promise<void> | void;

/**
 * Low-Level Design (LLD): Graceful Shutdown Lifecycle Manager
 * Handles clean resource cleanup (DB pools, Redis, HTTP server) on SIGTERM / SIGINT.
 */
export class GracefulShutdownManager {
  private hooks: { name: string; hook: ShutdownHook }[] = [];
  private isShuttingDown = false;
  private readonly timeoutMs: number;

  constructor(timeoutMs = 10000) {
    this.timeoutMs = timeoutMs;
  }

  public registerHook(name: string, hook: ShutdownHook): void {
    this.hooks.push({ name, hook });
  }

  public setupProcessListeners(): void {
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

    signals.forEach((signal) => {
      process.on(signal, () => {
        logger.info({ signal }, `Received signal [${signal}]. Initiating graceful shutdown...`);
        this.shutdown(0);
      });
    });

    process.on('uncaughtException', (err) => {
      logger.fatal({ error: err.message, stack: err.stack }, 'Uncaught Exception detected!');
      this.shutdown(1);
    });

    process.on('unhandledRejection', (reason: any) => {
      logger.error({ reason: reason?.message || reason }, 'Unhandled Rejection detected!');
    });
  }

  public async shutdown(exitCode = 0): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    const timeout = setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing process exit.');
      process.exit(1);
    }, this.timeoutMs);

    logger.info(`Executing ${this.hooks.length} shutdown hooks...`);

    for (const { name, hook } of this.hooks) {
      try {
        logger.info(`Running shutdown hook: [${name}]`);
        await hook();
      } catch (err: any) {
        logger.error({ hook: name, error: err.message }, `Error in shutdown hook [${name}]`);
      }
    }

    clearTimeout(timeout);
    logger.info('Graceful shutdown completed successfully. Exiting process.');
    process.exit(exitCode);
  }
}

export const defaultShutdownManager = new GracefulShutdownManager();
