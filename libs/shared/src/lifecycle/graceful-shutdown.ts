import { logger } from '../logger';

export enum ShutdownPhase {
  /**
   * Phase 1: Ingress Draining — Stop accepting new incoming HTTP requests (Fastify.close())
   */
  PHASE_1_INGRESS_DRAIN = 10,
  /**
   * Phase 2: Workers & Queues — Pause job queues and transactional outbox, wait for in-flight tasks
   */
  PHASE_2_WORKERS_AND_QUEUES = 20,
  /**
   * Phase 3: Locks & Leases — Release active distributed locks and leader leases
   */
  PHASE_3_LOCKS_AND_LEASES = 30,
  /**
   * Phase 4: Datastores & Connections — Disconnect PostgreSQL pools, Redis connections, flush logs
   */
  PHASE_4_DATASTORES_AND_CONNECTIONS = 40,
}

export type ShutdownHook = () => Promise<void> | void;

export interface RegisteredHook {
  name: string;
  hook: ShutdownHook;
  phase: ShutdownPhase;
  timeoutMs: number;
}

/**
 * Low-Level Design (LLD): Enterprise Topological Graceful Shutdown Manager
 * Features:
 * - 4-Phase Topological Teardown Pipeline preventing database/connection corruption
 * - Individual Hook Timeout Isolation preventing hung shutdown sequences
 * - Programmatic testing support without forced process exits
 */
export class GracefulShutdownManager {
  private hooks: RegisteredHook[] = [];
  private isShuttingDown = false;
  private readonly defaultTimeoutMs: number;

  constructor(defaultTimeoutMs = 15000) {
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  /**
   * Registers a shutdown hook assigned to a specific topological lifecycle phase.
   */
  public registerHook(
    name: string,
    hook: ShutdownHook,
    phase: ShutdownPhase = ShutdownPhase.PHASE_4_DATASTORES_AND_CONNECTIONS,
    timeoutMs: number = 5000
  ): void {
    this.hooks.push({ name, hook, phase, timeoutMs });
  }

  public getHooks(): RegisteredHook[] {
    return [...this.hooks];
  }

  public clearHooks(): void {
    this.hooks = [];
    this.isShuttingDown = false;
  }

  public setupProcessListeners(): void {
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

    signals.forEach((signal) => {
      process.on(signal, () => {
        logger.info({ signal }, `[Shutdown] Received signal [${signal}]. Initiating 4-phase graceful shutdown...`);
        this.shutdown({ exitCode: 0, exitProcess: true });
      });
    });

    process.on('uncaughtException', (err) => {
      logger.fatal({ error: err.message, stack: err.stack }, '[Shutdown] Uncaught Exception detected!');
      this.shutdown({ exitCode: 1, exitProcess: true });
    });

    process.on('unhandledRejection', (reason: any) => {
      logger.error({ reason: reason?.message || reason }, '[Shutdown] Unhandled Rejection detected!');
    });
  }

  /**
   * Executes the 4-phase shutdown sequence in strict topological order.
   */
  public async shutdown(options: { exitCode?: number; exitProcess?: boolean; timeoutMs?: number } = {}): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    const { exitCode = 0, exitProcess = true, timeoutMs = this.defaultTimeoutMs } = options;

    let globalTimer: NodeJS.Timeout | undefined;
    if (exitProcess) {
      globalTimer = setTimeout(() => {
        logger.error('[Shutdown] Global graceful shutdown timed out. Forcing process exit.');
        process.exit(1);
      }, timeoutMs);
    }

    logger.info(`[Shutdown] Initiating topological graceful shutdown (${this.hooks.length} registered hooks)...`);

    // Group hooks by phase in ascending order (10 -> 20 -> 30 -> 40)
    const phases = [
      ShutdownPhase.PHASE_1_INGRESS_DRAIN,
      ShutdownPhase.PHASE_2_WORKERS_AND_QUEUES,
      ShutdownPhase.PHASE_3_LOCKS_AND_LEASES,
      ShutdownPhase.PHASE_4_DATASTORES_AND_CONNECTIONS,
    ];

    for (const phase of phases) {
      const phaseHooks = this.hooks.filter((h) => h.phase === phase);
      if (phaseHooks.length === 0) continue;

      const phaseName = ShutdownPhase[phase];
      logger.info(`[Shutdown] Entering Phase ${phase} (${phaseName}) with ${phaseHooks.length} hooks...`);

      for (const { name, hook, timeoutMs: hookTimeout } of phaseHooks) {
        logger.info(`[Shutdown] Running hook: [${name}] (Phase ${phase})`);
        const startTime = Date.now();

        try {
          // Wrap individual hook execution with timeout guard
          const hookPromise = Promise.resolve(hook());
          let timer: NodeJS.Timeout;
          const timeoutPromise = new Promise<void>((_, reject) => {
            timer = setTimeout(() => reject(new Error(`Hook [${name}] timed out after ${hookTimeout}ms`)), hookTimeout);
          });

          await Promise.race([hookPromise, timeoutPromise]);
          clearTimeout(timer!);

          const duration = Date.now() - startTime;
          logger.info(`[Shutdown] Hook [${name}] completed successfully in ${duration}ms`);
        } catch (err: any) {
          logger.error({ hook: name, error: err.message, phase }, `[Shutdown] Error in hook [${name}]`);
        }
      }
    }

    if (globalTimer) clearTimeout(globalTimer);
    logger.info('[Shutdown] All 4 topological shutdown phases completed successfully.');

    if (exitProcess) {
      process.exit(exitCode);
    }
  }
}

export const defaultShutdownManager = new GracefulShutdownManager();
