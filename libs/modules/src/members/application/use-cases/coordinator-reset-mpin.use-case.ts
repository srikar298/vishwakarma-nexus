import { db } from "@vishwakarma-k-c/db";
import { users, identities } from "@vishwakarma-k-c/db/iam";
import { profiles } from "@vishwakarma-k-c/db/members";
import { eq, and } from "drizzle-orm";
import { 
  HashingService, 
  Result, 
  DynamicDomainError, 
  cacheProvider,
  auditLogger, 
  logger 
} from "@vishwakarma-k-c/shared";

export interface CoordinatorResetMpinCommand {
  targetUserPublicId: string;
  coordinatorPublicId: string;
  newMpin: string;
  reason: string;
}

export interface CoordinatorResetMpinResult {
  digitalId: string;
  targetUserPublicId: string;
  message: string;
}

export class CoordinatorResetMpinUseCase {
  public async execute(command: CoordinatorResetMpinCommand): Promise<Result<CoordinatorResetMpinResult, Error>> {
    const { targetUserPublicId, coordinatorPublicId, newMpin, reason } = command;

    // 1. Resolve Target User
    const [userRow] = await db
      .select()
      .from(users)
      .where(eq(users.publicId, targetUserPublicId))
      .limit(1);

    if (!userRow) {
      return Result.fail(new DynamicDomainError("USER_NOT_FOUND", "Member account not found."));
    }

    // 2. Resolve Profile & Primary Phone Identity
    const [profileRow] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userRow.id))
      .limit(1);

    const [identityRow] = await db
      .select()
      .from(identities)
      .where(
        and(
          eq(identities.userId, userRow.id),
          eq(identities.provider, "PHONE")
        )
      )
      .limit(1);

    if (!identityRow) {
      return Result.fail(new DynamicDomainError("IDENTITY_NOT_FOUND", "Member phone identity not found."));
    }

    // 3. Hash Temporary MPIN
    const credentialHash = HashingService.hashCredential(newMpin);

    // 4. Update Credential
    await db
      .update(identities)
      .set({
        credentialHash,
        updatedAt: new Date(),
      })
      .where(eq(identities.id, identityRow.id));

    // 5. Invalidate Sessions & Clear Lockouts
    const phoneKey = identityRow.identifier;
    const digitalId = profileRow?.digitalId;

    await Promise.all([
      cacheProvider.delete(`user_sessions:${targetUserPublicId}`),
      cacheProvider.delete(`auth:failed_attempts:${phoneKey}`),
      cacheProvider.delete(`auth:lockout:${phoneKey}`),
      digitalId ? cacheProvider.delete(`auth:failed_attempts:${digitalId}`) : Promise.resolve(),
      digitalId ? cacheProvider.delete(`auth:lockout:${digitalId}`) : Promise.resolve(),
      cacheProvider.delete(`auth:reset_challenge:attempts:${phoneKey}`),
      cacheProvider.delete(`auth:reset_challenge:lockout:${phoneKey}`),
    ]);

    // 6. Immutable Audit Trail
    await auditLogger.log({
      action: "COORDINATOR_MPIN_RESET",
      resourceType: "MEMBER",
      targetId: digitalId || targetUserPublicId,
      userId: coordinatorPublicId,
      severity: "WARNING",
      metadata: {
        targetUserPublicId,
        targetDigitalId: digitalId,
        coordinatorPublicId,
        reason,
      },
    });

    logger.info({
      msg: "MPIN Reset by Coordinator",
      targetUserPublicId,
      digitalId,
      coordinatorPublicId,
      reason,
    });

    return Result.ok({
      digitalId: digitalId || "N/A",
      targetUserPublicId,
      message: "MPIN has been successfully reset by coordinator.",
    });
  }
}
