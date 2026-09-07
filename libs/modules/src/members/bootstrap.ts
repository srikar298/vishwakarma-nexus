import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";

export const bootstrapMembersModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Members Module...");
  fastify.get("/members/health", async () => ({ status: "ok", module: "members" }));
  logger.info("Members Module initialized successfully.");
});
