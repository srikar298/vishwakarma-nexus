import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

export const bootstrapProfessionalsModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Professionals Module...");
  fastify.get("/professionals/health", async () => ({ status: "ok", module: "professionals" }));
  logger.info("Professionals Module initialized successfully.");
});
