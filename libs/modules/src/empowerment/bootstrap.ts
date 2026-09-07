import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

export const bootstrapEmpowermentModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Empowerment Module...");
  fastify.get("/empowerment/health", async () => ({ status: "ok", module: "empowerment" }));
  logger.info("Empowerment Module initialized successfully.");
});
