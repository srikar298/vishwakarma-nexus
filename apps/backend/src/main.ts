import { bootstrapApp } from "./app";
import { config, logger, GracefulShutdownManager, ShutdownPhase } from "@vishwakarma-k-c/shared";

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
