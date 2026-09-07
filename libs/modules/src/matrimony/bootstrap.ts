import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

export const bootstrapMatrimonyModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Matrimony Module...");
  fastify.get("/matrimony/health", async () => ({ status: "ok", module: "matrimony" }));
  logger.info("Matrimony Module initialized successfully.");
});
