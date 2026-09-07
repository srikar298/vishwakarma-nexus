import { bootstrapApp } from "./app";
import { 
  config, 
  logger, 
  GracefulShutdownManager, 
  ShutdownPhase, 
  RedisCacheProvider, 
  defaultAuditLogger 
} from "@vishwakarma-k-c/shared";
import { closeDatabaseConnection } from "@vishwakarma-k-c/db";

const start = async () => {
  const server = await bootstrapApp();

  // Initialize Topological 4-Phase Graceful Shutdown Manager
  const shutdownManager = new GracefulShutdownManager();

  // Phase 1: Ingress Draining — Stop accepting new HTTP requests
  shutdownManager.registerHook("fastify-http-server", async () => {
    logger.info("[Shutdown] Phase 1: Closing Fastify HTTP server...");
    await server.close();
    logger.info("[Shutdown] Fastify HTTP server closed.");
  }, ShutdownPhase.PHASE_1_INGRESS_DRAIN, 10000);

  // Phase 4: Datastores & Connections — Disconnect DB pools, Redis, and flush audit logs
  shutdownManager.registerHook("postgres-pool", async () => {
    logger.info("[Shutdown] Phase 4: Closing PostgreSQL connection pool...");
    await closeDatabaseConnection();
    logger.info("[Shutdown] PostgreSQL connection pool closed.");
  }, ShutdownPhase.PHASE_4_DATASTORES_AND_CONNECTIONS, 5000);

  shutdownManager.registerHook("redis-connection", async () => {
    logger.info("[Shutdown] Phase 4: Disconnecting Redis cache provider...");
    await RedisCacheProvider.getInstance().disconnect();
    logger.info("[Shutdown] Redis cache provider disconnected.");
  }, ShutdownPhase.PHASE_4_DATASTORES_AND_CONNECTIONS, 5000);

  shutdownManager.registerHook("audit-logger-flush", async () => {
    logger.info("[Shutdown] Phase 4: Flushing tamper-evident audit logs...");
    await defaultAuditLogger.flush?.();
    logger.info("[Shutdown] Audit logs flushed.");
  }, ShutdownPhase.PHASE_4_DATASTORES_AND_CONNECTIONS, 3000);

  // Setup OS process signal listeners (SIGTERM, SIGINT, uncaughtException)
  shutdownManager.setupProcessListeners();

  try {
    const address = await server.listen({ 
      port: config.app.port, 
      host: "0.0.0.0" 
    });
    
    logger.info(`🚀 Backend Modular Monolith running on ${address}`);
    logger.info(`Environment: ${config.app.env}`);
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }
};

start();
