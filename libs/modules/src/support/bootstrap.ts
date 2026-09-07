import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

export const bootstrapSupportModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Support Module...");
  fastify.get("/support/health", async () => ({ status: "ok", module: "support" }));
  logger.info("Support Module initialized successfully.");
});
