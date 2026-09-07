import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

export const bootstrapMessagingModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Messaging Module...");
  fastify.get("/messaging/health", async () => ({ status: "ok", module: "messaging" }));
  logger.info("Messaging Module initialized successfully.");
});
