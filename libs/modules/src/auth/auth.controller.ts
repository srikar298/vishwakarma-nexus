import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { 
  requestOtpSchema, 
  verifyOtpSchema, 
  refreshTokenSchema, 
  registerUserSchema,
  registerSchema,
  loginSchema,
  resetMpinChallengeSchema,
  AuthRateLimit,
  BaseDomainError,
  DynamicDomainError,
  logger
} from "@vishwakarma-k-c/shared";
import { RequestOtpUseCase } from "./application/use-cases/request-otp.use-case";
import { VerifyOtpUseCase } from "./application/use-cases/verify-otp.use-case";
import { RefreshTokenUseCase } from "./application/use-cases/refresh-token.use-case";
import { RegisterUserUseCase } from "./application/use-cases/register-user.use-case";
import { GetMeUseCase } from "./application/use-cases/get-me.use-case";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { ResetMpinChallengeUseCase } from "./application/use-cases/reset-mpin-challenge.use-case";
import { AuthPresentationMapper } from "./presentation/mappers/auth-presentation.mapper";
import { db } from "@vishwakarma-k-c/db";
import { permissions as permissionsTable } from "@vishwakarma-k-c/db/iam";

/**
 * LLD: Auth Controller
 * Handles HTTP request/response and delegates to Use Cases.
 */
export class AuthController {
  constructor(
    private readonly requestOtpUseCase: RequestOtpUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly registerUseCase?: RegisterUseCase,
    private readonly loginUseCase?: LoginUseCase,
    private readonly resetMpinChallengeUseCase?: ResetMpinChallengeUseCase
  ) {}

  /**
   * Fastify Route Registration
   * Implements Granular Rate Limiting & Enterprise Idempotency
   */
  public async routes(fastify: FastifyInstance) {
    // Core General Platform Onboarding & Login
    fastify.post("/register", {
      config: { rateLimit: AuthRateLimit, idempotency: true }
    }, this.register.bind(this));

    fastify.post("/login", {
      config: { rateLimit: AuthRateLimit }
    }, this.login.bind(this));

    // Zero-SMS Demographic Challenge MPIN Reset (Self-Service)
    fastify.post("/mpin/reset-challenge", {
      config: { rateLimit: AuthRateLimit, idempotency: true }
    }, this.resetMpinChallenge.bind(this));

    // OTP-based flows (available when DLT/SMS is active)
    fastify.post("/otp/request", {
      config: { rateLimit: AuthRateLimit, idempotency: true }
    }, this.requestOtp.bind(this));

    fastify.post("/otp/verify", {
      config: { rateLimit: AuthRateLimit }
    }, this.verifyOtp.bind(this));

    fastify.post("/refresh", this.refreshToken.bind(this));

    fastify.post("/register-legacy", {
      config: { rateLimit: AuthRateLimit, idempotency: true }
    }, this.registerUser.bind(this));

    // --- PROTECTED ROUTES ---

    fastify.get("/me", {
      preHandler: [fastify.authenticate]
    }, this.getMe.bind(this));

    fastify.get("/permissions", {
      preHandler: [fastify.authenticate, fastify.authorize("iam:read_all")]
    }, this.getAllPermissions.bind(this));
  }

  private async register(request: FastifyRequest, reply: FastifyReply) {
    const input = registerSchema.parse(request.body);
    if (!this.registerUseCase) {
      return reply.status(500).send({ success: false, error: "RegisterUseCase not configured" });
    }
    const result = await this.registerUseCase.execute(input);

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(201).send({
      success: true,
      message: "Registration successful. Digital ID issued.",
      data: result.getValue(),
    });
  }

  private async login(request: FastifyRequest, reply: FastifyReply) {
    const input = loginSchema.parse(request.body);
    if (!this.loginUseCase) {
      return reply.status(500).send({ success: false, error: "LoginUseCase not configured" });
    }
    const result = await this.loginUseCase.execute(input);

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      message: "Login successful.",
      data: result.getValue(),
    });
  }

  private async resetMpinChallenge(request: FastifyRequest, reply: FastifyReply) {
    const input = resetMpinChallengeSchema.parse(request.body);
    if (!this.resetMpinChallengeUseCase) {
      return reply.status(500).send({ success: false, error: "ResetMpinChallengeUseCase not configured" });
    }
    const result = await this.resetMpinChallengeUseCase.execute(input);

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      message: result.getValue().message,
      data: result.getValue(),
    });
  }

  private async requestOtp(request: FastifyRequest, reply: FastifyReply) {
    const input = requestOtpSchema.parse(request.body);
    const result = await this.requestOtpUseCase.execute(input);

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({ 
      success: true, 
      message: "OTP sent successfully",
      // Enterprise Tip: In development, you might expose the OTP here if needed for testing
    });
  }

  private async verifyOtp(request: FastifyRequest, reply: FastifyReply) {
    const input = verifyOtpSchema.parse(request.body);
    const result = await this.verifyOtpUseCase.execute(input);

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    const data = result.getValue();

    // If registration is required, we return a 200 but with a specific state
    if ('registerRequired' in data) {
      return reply.status(200).send({
        success: true,
        registerRequired: true,
        identifier: data.identifier
      });
    }

    return reply.status(200).send({
      success: true,
      tokens: data
    });
  }

  private async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    const input = refreshTokenSchema.parse(request.body);
    const result = await this.refreshTokenUseCase.execute(input);

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({
      success: true,
      tokens: result.getValue()
    });
  }

  private async registerUser(request: FastifyRequest, reply: FastifyReply) {
    const input = registerUserSchema.parse(request.body);
    const result = await this.registerUserUseCase.execute(input);

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    return reply.status(200).send({ 
      success: true, 
      user: AuthPresentationMapper.toUserResponse(result.getValue()) 
    });
  }

  private async getMe(request: FastifyRequest, reply: FastifyReply) {
    // request.user is populated by authenticate decorator
    const userId = request.user?.id;
    if (!userId) return reply.status(401).send({ error: "Unauthorized" });

    const result = await this.getMeUseCase.execute({ userId });

    if (result.isFailure) {
      return this.handleError(reply, result.getError());
    }

    const { user, permissions } = result.getValue();

    return reply.status(200).send({
      success: true,
      user: AuthPresentationMapper.toUserResponse(user),
      permissions
    });
  }

  private async getAllPermissions(request: FastifyRequest, reply: FastifyReply) {
    // Demonstrating simple unauthorized data fetch for admins
    const all = await db.select().from(permissionsTable);
    
    return reply.status(200).send({
      success: true,
      permissions: all
    });
  }

  /**
   * Global Module Error Handler
   */
  private handleError(reply: FastifyReply, error: Error) {
    logger.error({ error: error.message, stack: error.stack }, "Auth Module Error");

    if (error instanceof BaseDomainError) {
      const statusCodeMap: Record<string, number> = {
        "NOT_FOUND": 404,
        "CONFLICT": 409,
        "UNAUTHORIZED": 401,
        "INVALID_OTP": 400,
        "EXPIRED_OTP": 400,
        "TOO_MANY_ATTEMPTS": 429,
        "TOO_MANY_REQUESTS": 429,
        "ACCOUNT_LOCKED": 423,
        "INVALID_DEMOGRAPHIC_CHALLENGE": 400,
        "USER_NOT_FOUND": 404
      };

      const status = statusCodeMap[error.code] || 400;
      return reply.status(status).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          metadata: error.metadata
        }
      });
    }

    // Fallback for unexpected errors
    return reply.status(500).send({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred"
      }
    });
  }
}
