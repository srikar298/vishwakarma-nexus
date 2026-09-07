import { describe, it, expect, beforeEach } from 'vitest';
import { GracefulShutdownManager, ShutdownPhase } from './index';

describe('Component 11.1: Lifecycle Subsystem (Topological Graceful Shutdown)', () => {
  let shutdownManager: GracefulShutdownManager;

  beforeEach(() => {
    shutdownManager = new GracefulShutdownManager();
  });

  it('should execute registered hooks in strict topological 4-phase order', async () => {
    const executionOrder: string[] = [];

    // Register hooks out of order
    shutdownManager.registerHook('close_postgres_pool', async () => {
      executionOrder.push('PHASE_4: postgres');
    }, ShutdownPhase.PHASE_4_DATASTORES_AND_CONNECTIONS);

    shutdownManager.registerHook('drain_fastify_http', async () => {
      executionOrder.push('PHASE_1: fastify');
    }, ShutdownPhase.PHASE_1_INGRESS_DRAIN);

    shutdownManager.registerHook('release_distributed_locks', async () => {
      executionOrder.push('PHASE_3: locks');
    }, ShutdownPhase.PHASE_3_LOCKS_AND_LEASES);

    shutdownManager.registerHook('pause_job_queues', async () => {
      executionOrder.push('PHASE_2: queues');
    }, ShutdownPhase.PHASE_2_WORKERS_AND_QUEUES);

    shutdownManager.registerHook('disconnect_redis', async () => {
      executionOrder.push('PHASE_4: redis');
    }, ShutdownPhase.PHASE_4_DATASTORES_AND_CONNECTIONS);

    // Run shutdown programmatically without exiting process
    await shutdownManager.shutdown({ exitProcess: false });

    expect(executionOrder).toEqual([
      'PHASE_1: fastify',
      'PHASE_2: queues',
      'PHASE_3: locks',
      'PHASE_4: postgres',
      'PHASE_4: redis',
    ]);
  });

  it('should continue executing subsequent hooks even if one hook throws an exception', async () => {
    const executed: string[] = [];

    shutdownManager.registerHook('healthy_hook_1', () => {
      executed.push('hook1');
    }, ShutdownPhase.PHASE_1_INGRESS_DRAIN);

    shutdownManager.registerHook('failing_hook_2', () => {
      throw new Error('Database socket disconnected prematurely');
    }, ShutdownPhase.PHASE_2_WORKERS_AND_QUEUES);

    shutdownManager.registerHook('healthy_hook_3', () => {
      executed.push('hook3');
    }, ShutdownPhase.PHASE_3_LOCKS_AND_LEASES);

    await shutdownManager.shutdown({ exitProcess: false });

    expect(executed).toEqual(['hook1', 'hook3']);
  });

  it('should timeout individual hung hooks and proceed to next phase', async () => {
    const executed: string[] = [];

    shutdownManager.registerHook('hung_hook', async () => {
      await new Promise((r) => setTimeout(r, 500)); // takes 500ms
      executed.push('hung');
    }, ShutdownPhase.PHASE_1_INGRESS_DRAIN, 50); // timeout is 50ms

    shutdownManager.registerHook('next_phase_hook', () => {
      executed.push('next_phase');
    }, ShutdownPhase.PHASE_2_WORKERS_AND_QUEUES);

    await shutdownManager.shutdown({ exitProcess: false });

    expect(executed).toEqual(['next_phase']);
  });
});
