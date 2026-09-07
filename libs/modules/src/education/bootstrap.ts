import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

export const bootstrapEducationModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Education Module...");
  fastify.get("/education/health", async () => ({ status: "ok", module: "education" }));
  logger.info("Education Module initialized successfully.");
});
