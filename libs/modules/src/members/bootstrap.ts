import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";
import { GetMemberProfileUseCase } from "./application/use-cases/get-member-profile.use-case";
import { UpdateContactUseCase } from "./application/use-cases/update-contact.use-case";
import { SearchMembersUseCase } from "./application/use-cases/search-members.use-case";
import { CoordinatorResetMpinUseCase } from "./application/use-cases/coordinator-reset-mpin.use-case";
import { MembersController } from "./members.controller";

export const bootstrapMembersModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Members Module...");

  // 1. Instantiate Use Cases
  const getMemberProfileUseCase = new GetMemberProfileUseCase();
  const updateContactUseCase = new UpdateContactUseCase();
  const searchMembersUseCase = new SearchMembersUseCase();
  const coordinatorResetMpinUseCase = new CoordinatorResetMpinUseCase();

  // 2. Instantiate Controller
  const controller = new MembersController(
    getMemberProfileUseCase,
    updateContactUseCase,
    searchMembersUseCase,
    coordinatorResetMpinUseCase
  );

  // 3. Register Routes under /members prefix
  await fastify.register(controller.routes.bind(controller), { prefix: "/members" });

  fastify.get("/members/health", async () => ({ status: "ok", module: "members" }));
  logger.info("Members Module initialized successfully.");
});
