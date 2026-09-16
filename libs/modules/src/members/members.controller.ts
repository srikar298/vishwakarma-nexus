import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { 
  updateContactSchema, 
  coordinatorResetMpinSchema,
  updateLocationSchema,
  createAnnouncementSchema,
  BaseDomainError, 
  logger 
} from "@vishwakarma-k-c/shared";
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

export class MembersController {
  constructor(
    private readonly getMemberProfileUseCase: GetMemberProfileUseCase,
    private readonly updateContactUseCase: UpdateContactUseCase,
    private readonly searchMembersUseCase: SearchMembersUseCase,
    private readonly coordinatorResetMpinUseCase?: CoordinatorResetMpinUseCase,
    private readonly getIdCardUseCase?: GetIdCardUseCase,
    private readonly verifyDigitalIdUseCase?: VerifyDigitalIdUseCase,
    private readonly updateLocationUseCase?: UpdateLocationUseCase,
    private readonly voteBankAnalyticsUseCase?: VoteBankAnalyticsUseCase,
    private readonly announcementsUseCase?: AnnouncementsUseCase,
    private readonly getAdminRegistrationsUseCase?: GetAdminRegistrationsUseCase,
    private readonly suspendMemberUseCase?: SuspendMemberUseCase
  ) {}

  public async routes(fastify: FastifyInstance) {
    // --- MEMBER SELF-SERVICE ROUTES (PROTECTED) ---

    fastify.get("/me", {
      preHandler: [fastify.authenticate],
    }, this.getMe.bind(this));

    fastify.patch("/me/contact", {
      preHandler: [fastify.authenticate],
    }, this.updateMyContact.bind(this));

    // Progressive Post-Registration In-App Location Refinement Modal
    fastify.patch("/me/location", {
      preHandler: [fastify.authenticate],
    }, this.updateMyLocation.bind(this));

    // Community Digital Pass (Dynamic Vector SVG & WhatsApp Sharing)
    fastify.get("/me/id-card", {
      preHandler: [fastify.authenticate],
    }, this.getMyIdCard.bind(this));

    fastify.get("/me/id-card/download", {
      preHandler: [fastify.authenticate],
    }, this.downloadMyIdCard.bind(this));

    // --- PUBLIC QR VERIFICATION (SANITIZED PII) ---

    fastify.get("/verify/:digitalId", this.publicVerifyDigitalId.bind(this));

    // --- COMMUNITY ANNOUNCEMENTS ---

    fastify.get("/announcements", {
      preHandler: [fastify.authenticate],
    }, this.getAnnouncements.bind(this));

    fastify.post("/admin/announcements", {
      preHandler: [fastify.authenticate],
    }, this.createAnnouncement.bind(this));

    // --- DIRECTORY & ADMIN ROSTER ---

    fastify.get("/search", {
      preHandler: [fastify.authenticate],
    }, this.search.bind(this));

    fastify.get("/admin/registrations", {
      preHandler: [fastify.authenticate],
    }, this.getAdminRegistrations.bind(this));

    // --- CONFIDENTIAL VOTE BANK & ELECTORAL INTELLIGENCE ---

    fastify.get("/admin/vote-bank-analytics", {
      preHandler: [fastify.authenticate],
    }, this.getVoteBankAnalytics.bind(this));

    fastify.patch("/admin/:userPublicId/suspend", {
      preHandler: [fastify.authenticate],
    }, this.suspendMember.bind(this));

    // --- ON-GROUND COORDINATOR HELPDESK TOOLS ---

    fastify.patch("/:userPublicId/contact", {
      preHandler: [fastify.authenticate],
    }, this.coordinatorUpdateContact.bind(this));

    fastify.post("/:userPublicId/reset-mpin", {
      preHandler: [fastify.authenticate],
    }, this.coordinatorResetMpin.bind(this));
  }

  private async getMe(request: FastifyRequest, reply: FastifyReply) {
    const userPublicId = request.user?.id;
    if (!userPublicId) {
      return reply.status(401).send({ success: false, error: "Unauthorized" });
    }

    const result = await this.getMemberProfileUseCase.execute(userPublicId);
    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      data: result.getValue(),
    });
  }

  private async updateMyContact(request: FastifyRequest, reply: FastifyReply) {
    const userPublicId = request.user?.id;
    if (!userPublicId) {
      return reply.status(401).send({ success: false, error: "Unauthorized" });
    }

    const input = updateContactSchema.parse(request.body);
    const result = await this.updateContactUseCase.execute({
      userPublicId,
      phone: input.phone,
      email: input.email,
    });

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      message: "Contact details updated successfully. Unverified until confirmed.",
      data: result.getValue(),
    });
  }

  private async updateMyLocation(request: FastifyRequest, reply: FastifyReply) {
    const userPublicId = request.user?.id;
    if (!userPublicId) {
      return reply.status(401).send({ success: false, error: "Unauthorized" });
    }
    if (!this.updateLocationUseCase) {
      return reply.status(500).send({ success: false, error: "UpdateLocationUseCase not configured" });
    }

    const input = updateLocationSchema.parse(request.body);
    const result = await this.updateLocationUseCase.execute({
      userPublicId,
      latitude: input.latitude,
      longitude: input.longitude,
      wardOrVillage: input.wardOrVillage,
    });

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      message: result.getValue().message,
      data: result.getValue(),
    });
  }

  private async getMyIdCard(request: FastifyRequest, reply: FastifyReply) {
    const userPublicId = request.user?.id;
    if (!userPublicId) {
      return reply.status(401).send({ success: false, error: "Unauthorized" });
    }
    if (!this.getIdCardUseCase) {
      return reply.status(500).send({ success: false, error: "GetIdCardUseCase not configured" });
    }

    const result = await this.getIdCardUseCase.execute(userPublicId);
    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    reply.header("Cache-Control", "private, max-age=3600, stale-while-revalidate=86400");
    return reply.status(200).send({
      success: true,
      data: result.getValue(),
    });
  }

  private async downloadMyIdCard(request: FastifyRequest, reply: FastifyReply) {
    const userPublicId = request.user?.id;
    if (!userPublicId) {
      return reply.status(401).send({ success: false, error: "Unauthorized" });
    }
    if (!this.getIdCardUseCase) {
      return reply.status(500).send({ success: false, error: "GetIdCardUseCase not configured" });
    }

    const result = await this.getIdCardUseCase.execute(userPublicId);
    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    const card = result.getValue();
    reply.header("Content-Type", "image/svg+xml; charset=utf-8");
    reply.header("Content-Disposition", `attachment; filename="${card.digitalId}.svg"`);
    reply.header("Cache-Control", "private, max-age=86400");
    return reply.status(200).send(card.svg);
  }

  private async publicVerifyDigitalId(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { digitalId: string };
    if (!this.verifyDigitalIdUseCase) {
      return reply.status(500).send({ success: false, error: "VerifyDigitalIdUseCase not configured" });
    }

    const result = await this.verifyDigitalIdUseCase.execute(params.digitalId);
    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    // Edge CDN / Cloudflare and browser cacheable for 60-300 seconds
    reply.header("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    return reply.status(200).send({
      success: true,
      data: result.getValue(),
    });
  }

  private async getAnnouncements(request: FastifyRequest, reply: FastifyReply) {
    if (!this.announcementsUseCase) {
      return reply.status(500).send({ success: false, error: "AnnouncementsUseCase not configured" });
    }

    const query = request.query as { district?: string; kula?: string };
    const result = await this.announcementsUseCase.getActive(query.district, query.kula);
    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      data: result.getValue(),
    });
  }

  private async createAnnouncement(request: FastifyRequest, reply: FastifyReply) {
    const authorPublicId = request.user?.id;
    if (!authorPublicId) {
      return reply.status(401).send({ success: false, error: "Unauthorized" });
    }
    if (!this.announcementsUseCase) {
      return reply.status(500).send({ success: false, error: "AnnouncementsUseCase not configured" });
    }

    const input = createAnnouncementSchema.parse(request.body);
    const result = await this.announcementsUseCase.create({
      authorPublicId,
      title: input.title,
      content: input.content,
      category: input.category,
      priority: input.priority,
      targetDistrict: input.targetDistrict,
      targetKula: input.targetKula,
      actionUrl: input.actionUrl,
      expiresAt: input.expiresAt,
    });

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(201).send({
      success: true,
      data: result.getValue(),
    });
  }

  private async search(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as any;
    const result = await this.searchMembersUseCase.execute({
      query: query.q || query.query,
      district: query.district,
      kula: query.kula,
      source: query.source,
      limit: query.limit ? Number(query.limit) : 20,
      offset: query.offset ? Number(query.offset) : 0,
    });

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      data: result.getValue(),
    });
  }

  private async getAdminRegistrations(request: FastifyRequest, reply: FastifyReply) {
    if (!this.getAdminRegistrationsUseCase) {
      return reply.status(500).send({ success: false, error: "GetAdminRegistrationsUseCase not configured" });
    }

    const q = request.query as any;
    const result = await this.getAdminRegistrationsUseCase.execute({
      source: q.source,
      district: q.district,
      kula: q.kula,
      intent: q.intent,
      search: q.search,
      limit: q.limit ? Number(q.limit) : 25,
      offset: q.offset ? Number(q.offset) : 0,
    });

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      data: result.getValue(),
    });
  }

  private async getVoteBankAnalytics(request: FastifyRequest, reply: FastifyReply) {
    if (!this.voteBankAnalyticsUseCase) {
      return reply.status(500).send({ success: false, error: "VoteBankAnalyticsUseCase not configured" });
    }

    const result = await this.voteBankAnalyticsUseCase.execute();
    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      data: result.getValue(),
    });
  }

  private async suspendMember(request: FastifyRequest, reply: FastifyReply) {
    const adminPublicId = request.user?.id;
    if (!adminPublicId) {
      return reply.status(401).send({ success: false, error: "Unauthorized" });
    }
    if (!this.suspendMemberUseCase) {
      return reply.status(500).send({ success: false, error: "SuspendMemberUseCase not configured" });
    }

    const params = request.params as { userPublicId: string };
    const body = request.body as { reason?: string };

    const result = await this.suspendMemberUseCase.execute({
      targetUserPublicId: params.userPublicId,
      adminPublicId,
      reason: body?.reason || "Administrative suspension",
    });

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      message: result.getValue().message,
    });
  }

  private async coordinatorUpdateContact(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { userPublicId: string };
    const input = updateContactSchema.parse(request.body);

    const result = await this.updateContactUseCase.execute({
      userPublicId: params.userPublicId,
      phone: input.phone,
      email: input.email,
    });

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      message: "Member contact updated successfully by coordinator.",
      data: result.getValue(),
    });
  }

  private async coordinatorResetMpin(request: FastifyRequest, reply: FastifyReply) {
    const coordinatorPublicId = request.user?.id;
    if (!coordinatorPublicId) {
      return reply.status(401).send({ success: false, error: "Unauthorized" });
    }

    const params = request.params as { userPublicId: string };
    const input = coordinatorResetMpinSchema.parse(request.body);

    if (!this.coordinatorResetMpinUseCase) {
      return reply.status(500).send({ success: false, error: "CoordinatorResetMpinUseCase not configured" });
    }

    const result = await this.coordinatorResetMpinUseCase.execute({
      targetUserPublicId: params.userPublicId,
      coordinatorPublicId,
      newMpin: input.newMpin,
      reason: input.reason,
    });

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      message: result.getValue().message,
      data: result.getValue(),
    });
  }

  private handleError(reply: FastifyReply, error: Error) {
    logger.error({ error: error.message, stack: error.stack }, "Members Module Error");

    if (error instanceof BaseDomainError) {
      const statusCodeMap: Record<string, number> = {
        "NOT_FOUND": 404,
        "USER_NOT_FOUND": 404,
        "PROFILE_NOT_FOUND": 404,
        "IDENTITY_NOT_FOUND": 404,
        "DIGITAL_ID_NOT_FOUND": 404,
        "PHONE_ALREADY_IN_USE": 409,
        "INVALID_PHONE": 400,
        "INVALID_DIGITAL_ID": 400,
        "NO_CHANGES": 400,
        "VALIDATION_ERROR": 400,
      };

      const status = statusCodeMap[error.code] || 400;
      return reply.status(status).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    return reply.status(500).send({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    });
  }
}
