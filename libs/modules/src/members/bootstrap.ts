import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { logger } from "@vishwakarma-k-c/shared";
import { DrizzleAuthRepository } from "../auth/infrastructure/repositories/drizzle-iam.repository";
import { GetMemberProfileUseCase } from "./application/use-cases/get-member-profile.use-case";
import { UpdateContactUseCase } from "./application/use-cases/update-contact.use-case";
import { SearchMembersUseCase } from "./application/use-cases/search-members.use-case";
import { CoordinatorResetMpinUseCase } from "./application/use-cases/coordinator-reset-mpin.use-case";
import { GetIdCardUseCase } from "./application/use-cases/get-id-card.use-case";
import { VerifyDigitalIdUseCase } from "./application/use-cases/verify-digital-id.use-case";
import { UpdateLocationUseCase } from "./application/use-cases/update-location.use-case";
import { VoteBankAnalyticsUseCase } from "./application/use-cases/vote-bank-analytics.use-case";
import { AnnouncementsUseCase } from "./application/use-cases/announcements.use-case";
import { GetAdminRegistrationsUseCase } from "./application/use-cases/get-admin-registrations.use-case";
import { SuspendMemberUseCase } from "./application/use-cases/suspend-member.use-case";
import { MembersController } from "./members.controller";

export const bootstrapMembersModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Members Module...");

  const authRepo = new DrizzleAuthRepository();

  // 1. Instantiate Use Cases
  const getMemberProfileUseCase = new GetMemberProfileUseCase();
  const updateContactUseCase = new UpdateContactUseCase();
  const searchMembersUseCase = new SearchMembersUseCase();
  const coordinatorResetMpinUseCase = new CoordinatorResetMpinUseCase();
  const getIdCardUseCase = new GetIdCardUseCase();
  const verifyDigitalIdUseCase = new VerifyDigitalIdUseCase();
  const updateLocationUseCase = new UpdateLocationUseCase();
  const voteBankAnalyticsUseCase = new VoteBankAnalyticsUseCase();
  const announcementsUseCase = new AnnouncementsUseCase();
  const getAdminRegistrationsUseCase = new GetAdminRegistrationsUseCase();
  const suspendMemberUseCase = new SuspendMemberUseCase(authRepo);

  // 2. Instantiate Controller
  const controller = new MembersController(
    getMemberProfileUseCase,
    updateContactUseCase,
    searchMembersUseCase,
    coordinatorResetMpinUseCase,
    getIdCardUseCase,
    verifyDigitalIdUseCase,
    updateLocationUseCase,
    voteBankAnalyticsUseCase,
    announcementsUseCase,
    getAdminRegistrationsUseCase,
    suspendMemberUseCase
  );

  // 3. Register Routes under /members prefix
  await fastify.register(controller.routes.bind(controller), { prefix: "/members" });

  fastify.get("/members/health", async () => ({ status: "ok", module: "members" }));
  logger.info("Members Module initialized successfully.");
});
