import { Result, auditLogger, logger } from "@vishwakarma-k-c/shared";
import { TokenService } from "../services/token.service";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export interface LogoutCommand {
  userPublicId: string;
}

export interface LogoutResult {
  message: string;
}

/**
 * LogoutUseCase
 * Enforces cluster-wide instant session termination via min_valid_iat epoch invalidation.
 */
export class LogoutUseCase {
  private readonly tokenService: TokenService;

  constructor(private readonly authRepository: IAuthRepository) {
    this.tokenService = new TokenService(this.authRepository);
  }

  public async execute(command: LogoutCommand): Promise<Result<LogoutResult, Error>> {
    const { userPublicId } = command;

    // Distributed instant session invalidation
    await this.tokenService.revokeAllSessions(userPublicId);

    await auditLogger.log({
      action: "USER_LOGOUT",
      resourceType: "IAM",
      targetId: userPublicId,
      userId: userPublicId,
      severity: "INFO",
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    logger.info({ userPublicId }, "User session terminated across all pods");

    return Result.ok({
      message: "Logged out successfully. Active sessions invalidated.",
    });
  }
}
