import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { 
  updateContactSchema, 
  coordinatorResetMpinSchema,
  BaseDomainError, 
  logger 
} from "@vishwakarma-k-c/shared";
import { GetMemberProfileUseCase } from "./application/use-cases/get-member-profile.use-case";
import { UpdateContactUseCase } from "./application/use-cases/update-contact.use-case";
import { SearchMembersUseCase } from "./application/use-cases/search-members.use-case";
import { CoordinatorResetMpinUseCase } from "./application/use-cases/coordinator-reset-mpin.use-case";

export class MembersController {
  constructor(
    private readonly getMemberProfileUseCase: GetMemberProfileUseCase,
    private readonly updateContactUseCase: UpdateContactUseCase,
    private readonly searchMembersUseCase: SearchMembersUseCase,
    private readonly coordinatorResetMpinUseCase?: CoordinatorResetMpinUseCase
  ) {}

  public async routes(fastify: FastifyInstance) {
    // Member Self-Service Routes (Protected)
    fastify.get("/me", {
      preHandler: [fastify.authenticate],
    }, this.getMe.bind(this));

    fastify.patch("/me/contact", {
      preHandler: [fastify.authenticate],
    }, this.updateMyContact.bind(this));

    // Community Directory & On-Ground Helpdesk Search
    fastify.get("/search", {
      preHandler: [fastify.authenticate],
    }, this.search.bind(this));

    // Volunteer / Coordinator Admin Correction (Allows helpdesk to fix typo for an attendee)
    fastify.patch("/:userPublicId/contact", {
      preHandler: [fastify.authenticate],
    }, this.coordinatorUpdateContact.bind(this));

    // Volunteer / Coordinator On-Ground MPIN Reset (e.g. at Ektha Yatra Helpdesk)
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
        "PHONE_ALREADY_IN_USE": 409,
        "INVALID_PHONE": 400,
        "NO_CHANGES": 400,
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
