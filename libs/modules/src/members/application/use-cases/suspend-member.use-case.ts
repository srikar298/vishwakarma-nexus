import { db } from "@vishwakarma-k-c/db";
import { users } from "@vishwakarma-k-c/db/iam";
import { profiles } from "@vishwakarma-k-c/db/members";
import { eq } from "drizzle-orm";
import { Result, DynamicDomainError, auditLogger, logger } from "@vishwakarma-k-c/shared";
import { TokenService } from "../../../auth/application/services/token.service";
import { IAuthRepository } from "../../../auth/domain/repositories/auth.repository.interface";

export interface SuspendMemberCommand {
  targetUserPublicId: string;
  adminPublicId: string;
  reason: string;
}

/**
 * SuspendMemberUseCase
 * Deactivates an abusive, spam, or duplicate member account and
 * instantly terminates all active access tokens across all pods via min_valid_iat.
 */
export class SuspendMemberUseCase {
  private readonly tokenService: TokenService;

  constructor(private readonly authRepository: IAuthRepository) {
    this.tokenService = new TokenService(this.authRepository);
  }

  public async execute(command: SuspendMemberCommand): Promise<Result<{ message: string }, Error>> {
    const { targetUserPublicId, adminPublicId, reason } = command;

    const [targetUser] = await db
      .select({ id: users.id, publicId: users.publicId })
      .from(users)
      .where(eq(users.publicId, targetUserPublicId))
      .limit(1);

    if (!targetUser) {
      return Result.fail(new DynamicDomainError("USER_NOT_FOUND", "Member not found."));
    }

    const now = new Date();

    // 1. Soft-delete user and profile
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ deletedAt: now, updatedAt: now })
        .where(eq(users.id, targetUser.id));

      await tx
        .update(profiles)
        .set({ deletedAt: now, updatedAt: now })
        .where(eq(profiles.userId, targetUser.id));
    });

    // 2. Instant cluster-wide session revocation
    await this.tokenService.revokeAllSessions(targetUser.publicId);

    // 3. Security & Compliance Audit Log
    await auditLogger.log({
      action: "MEMBER_SUSPENDED",
      resourceType: "MEMBER",
      targetId: targetUser.publicId,
      userId: adminPublicId,
      severity: "WARNING",
      metadata: {
        reason,
        timestamp: now.toISOString(),
      },
    });

    logger.warn({ targetUserPublicId, adminPublicId, reason }, "Member account suspended and sessions revoked");

    return Result.ok({
      message: "Member account suspended and all active sessions revoked successfully.",
    });
  }
}
