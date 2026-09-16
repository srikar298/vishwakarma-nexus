import { db } from "@vishwakarma-k-c/db";
import { users, identities } from "@vishwakarma-k-c/db/iam";
import { eq, and } from "drizzle-orm";
import { 
  HashingService, 
  Result, 
  DynamicDomainError, 
  auditLogger, 
  logger 
} from "@vishwakarma-k-c/shared";
import { TokenService } from "../services/token.service";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export interface ChangeMpinCommand {
  userPublicId: string;
  currentMpin: string;
  newMpin: string;
}

export interface ChangeMpinResult {
  message: string;
}

/**
 * ChangeMpinUseCase
 * Authenticated self-service MPIN update.
 * Verifies current MPIN, updates credential hash, and revokes older sessions across pods.
 */
export class ChangeMpinUseCase {
  private readonly tokenService: TokenService;

  constructor(private readonly authRepository: IAuthRepository) {
    this.tokenService = new TokenService(this.authRepository);
  }

  public async execute(command: ChangeMpinCommand): Promise<Result<ChangeMpinResult, Error>> {
    const { userPublicId, currentMpin, newMpin } = command;

    if (currentMpin === newMpin) {
      return Result.fail(
        new DynamicDomainError("VALIDATION_ERROR", "New MPIN cannot be the same as your current MPIN.")
      );
    }

    // 1. Fetch user by publicId
    const [userRow] = await db
      .select({ id: users.id, publicId: users.publicId })
      .from(users)
      .where(eq(users.publicId, userPublicId))
      .limit(1);

    if (!userRow) {
      return Result.fail(new DynamicDomainError("USER_NOT_FOUND", "User not found."));
    }

    // 2. Fetch primary Phone Identity
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

    if (!identityRow || !identityRow.credentialHash) {
      return Result.fail(new DynamicDomainError("IDENTITY_NOT_FOUND", "No MPIN credential set for this account."));
    }

    // 3. Verify Current MPIN (Constant-Time Scrypt)
    const isValid = HashingService.verifyCredential(currentMpin, identityRow.credentialHash);
    if (!isValid) {
      return Result.fail(
        new DynamicDomainError("INVALID_CREDENTIALS", "Current MPIN is incorrect. Please verify and try again.")
      );
    }

    // 4. Hash and Persist New MPIN
    const newCredentialHash = HashingService.hashCredential(newMpin);

    await db
      .update(identities)
      .set({
        credentialHash: newCredentialHash,
        updatedAt: new Date(),
      })
      .where(eq(identities.id, identityRow.id));

    // 5. Invalidate existing sessions across pods for security hygiene
    await this.tokenService.revokeAllSessions(userRow.publicId);

    // 6. Audit Logging
    await auditLogger.log({
      action: "MPIN_CHANGED",
      resourceType: "IAM",
      targetId: userRow.publicId,
      userId: userRow.publicId,
      severity: "INFO",
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    logger.info({ userPublicId: userRow.publicId }, "MPIN changed successfully");

    return Result.ok({
      message: "MPIN changed successfully. Please log in with your new MPIN.",
    });
  }
}
