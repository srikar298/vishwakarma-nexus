import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

export const bootstrapHeritageModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Heritage Module...");
  fastify.get("/heritage/health", async () => ({ status: "ok", module: "heritage" }));
  logger.info("Heritage Module initialized successfully.");
});
