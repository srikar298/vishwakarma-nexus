import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

export const bootstrapGovernanceModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Governance Module...");
  fastify.get("/governance/health", async () => ({ status: "ok", module: "governance" }));
  logger.info("Governance Module initialized successfully.");
});
