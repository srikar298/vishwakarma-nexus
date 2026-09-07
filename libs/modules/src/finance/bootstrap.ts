import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

/**
 * Finance Module Bootstrap
 * Handles payments, ledgers, and transactions.
 */
export const bootstrapFinanceModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Finance Module...");

  // TODO: Instantiate Infrastructure
  // TODO: Instantiate Use Cases
  // TODO: Register Routes

  fastify.get("/finance/health", async () => {
    return { status: "ok", module: "finance" };
  });

  logger.info("Finance Module initialized successfully.");
});
