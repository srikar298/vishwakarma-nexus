import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

export const bootstrapCommunityModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Community Module...");
  fastify.get("/community/health", async () => ({ status: "ok", module: "community" }));
  logger.info("Community Module initialized successfully.");
});
