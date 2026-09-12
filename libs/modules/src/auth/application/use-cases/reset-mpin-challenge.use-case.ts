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
import { TokenService } from "../services/token.service";
import { PhoneNumber } from "../../domain/value-objects/phone-number.vo";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export interface ResetMpinChallengeCommand {
  identifier: string; // Phone number or Digital ID (VKC-2026-XXXXX)
  kula: string;
  district: string;
  newMpin: string;
}

export interface ResetMpinChallengeResult {
  digitalId: string;
  message: string;
}

export class ResetMpinChallengeUseCase {
  private readonly tokenService: TokenService;
  private static readonly MAX_CHALLENGE_ATTEMPTS = 3;
  private static readonly LOCKOUT_TTL_SECONDS = 15 * 60; // 15 minutes

  constructor(private readonly authRepository: IAuthRepository) {
    this.tokenService = new TokenService(this.authRepository);
  }

  public async execute(command: ResetMpinChallengeCommand): Promise<Result<ResetMpinChallengeResult, Error>> {
    const { identifier, kula, district, newMpin } = command;
    const trimmedId = identifier.trim();

    let targetUserId: number | null = null;
    let normalizedPhoneKey: string | null = null;

    // 1. Dual-Identifier Resolution: Digital ID vs Phone Number
    if (trimmedId.toUpperCase().startsWith("VKC-") || trimmedId.toUpperCase().startsWith("VKC")) {
      const upperDigitalId = trimmedId.toUpperCase();
      const profileRows = await db
        .select()
        .from(profiles)
        .where(eq(profiles.digitalId, upperDigitalId))
        .limit(1);

      if (profileRows.length === 0) {
        return Result.fail(new DynamicDomainError("USER_NOT_FOUND", "Account not found for the provided Digital ID."));
      }

      targetUserId = profileRows[0].userId;
      normalizedPhoneKey = upperDigitalId;
    } else {
      let normalizedPhone: string;
      try {
        normalizedPhone = new PhoneNumber(trimmedId).toString();
      } catch {
        const cleaned = trimmedId.replace(/\D/g, "");
        if (cleaned.length === 10) {
          normalizedPhone = `+91${cleaned}`;
        } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
          normalizedPhone = `+${cleaned}`;
        } else {
          return Result.fail(new DynamicDomainError("INVALID_IDENTIFIER", "Invalid phone number or Digital ID format."));
        }
      }

      normalizedPhoneKey = normalizedPhone;

      const identityRows = await db
        .select()
        .from(identities)
        .where(
          and(
            eq(identities.provider, "PHONE"),
            eq(identities.identifier, normalizedPhone)
          )
        )
        .limit(1);

      if (identityRows.length === 0) {
        return Result.fail(new DynamicDomainError("USER_NOT_FOUND", "Account not found for the provided phone number."));
      }

      targetUserId = identityRows[0].userId;
    }

    // 2. Brute-force lockout defense on challenge verification
    const lockoutKey = `auth:reset_challenge:lockout:${normalizedPhoneKey}`;
    const isLocked = await cacheProvider.get(lockoutKey);
    if (isLocked) {
      return Result.fail(
        new DynamicDomainError(
          "ACCOUNT_LOCKED", 
          "Too many failed verification attempts. This account is temporarily locked for 15 minutes. Please try again later or visit an Ektha Yatra helpdesk coordinator."
        )
      );
    }

    // 3. Fetch User & Profile for Demographic Challenge
    const [userRow] = await db
      .select()
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);

    const [profileRow] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, targetUserId))
      .limit(1);

    if (!userRow || !profileRow) {
      return Result.fail(new DynamicDomainError("USER_NOT_FOUND", "Member profile could not be located."));
    }

    // 4. Verify Demographic Challenge (Kula + District match)
    const expectedKula = (profileRow.kula || "").trim().toLowerCase();
    const providedKula = kula.trim().toLowerCase();
    const expectedDistrict = (profileRow.district || "").trim().toLowerCase();
    const providedDistrict = district.trim().toLowerCase();

    const attemptsKey = `auth:reset_challenge:attempts:${normalizedPhoneKey}`;

    if (expectedKula !== providedKula || expectedDistrict !== providedDistrict) {
      const currentAttempts = ((await cacheProvider.get<number>(attemptsKey)) || 0) + 1;
      await cacheProvider.set(attemptsKey, currentAttempts, ResetMpinChallengeUseCase.LOCKOUT_TTL_SECONDS);

      if (currentAttempts >= ResetMpinChallengeUseCase.MAX_CHALLENGE_ATTEMPTS) {
        await cacheProvider.set(lockoutKey, "LOCKED", ResetMpinChallengeUseCase.LOCKOUT_TTL_SECONDS);
        
        await auditLogger.log({
          action: "MPIN_RESET_CHALLENGE_LOCKOUT",
          resourceType: "MEMBER",
          targetId: profileRow.digitalId || userRow.publicId,
          userId: userRow.publicId,
          severity: "WARNING",
          metadata: {
            attempts: currentAttempts,
            normalizedPhoneKey,
          },
        });

        return Result.fail(
          new DynamicDomainError(
            "TOO_MANY_ATTEMPTS",
            "Demographic verification failed 3 times. Account locked for 15 minutes to protect your identity."
          )
        );
      }

      const remaining = ResetMpinChallengeUseCase.MAX_CHALLENGE_ATTEMPTS - currentAttempts;
      return Result.fail(
        new DynamicDomainError(
          "INVALID_DEMOGRAPHIC_CHALLENGE",
          `Demographic details (Kula or District) do not match our records. ${remaining} attempt(s) remaining.`
        )
      );
    }

    // 5. Successful Challenge: Hash new MPIN and persist
    const newCredentialHash = HashingService.hashCredential(newMpin);

    await db
      .update(identities)
      .set({ 
        credentialHash: newCredentialHash,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(identities.userId, targetUserId),
          eq(identities.provider, "PHONE")
        )
      );

    // 6. Security Sanitization: Revoke existing active sessions
    await this.tokenService.revokeAllSessions(userRow.publicId);

    // 7. Clear all lockout and failed attempts caches
    await Promise.all([
      cacheProvider.delete(attemptsKey),
      cacheProvider.delete(lockoutKey),
      cacheProvider.delete(`auth:failed_attempts:${normalizedPhoneKey}`),
      cacheProvider.delete(`auth:lockout:${normalizedPhoneKey}`),
    ]);

    // 8. Tamper-evident Audit Logging
    await auditLogger.log({
      action: "MPIN_RESET_DEMOGRAPHIC_CHALLENGE",
      resourceType: "MEMBER",
      targetId: profileRow.digitalId || userRow.publicId,
      userId: userRow.publicId,
      severity: "INFO",
      metadata: {
        digitalId: profileRow.digitalId,
        resetMethod: "DEMOGRAPHIC_CHALLENGE",
      },
    });

    logger.info({
      msg: "MPIN Reset Successfully via Demographic Challenge",
      digitalId: profileRow.digitalId,
      publicId: userRow.publicId,
    });

    return Result.ok({
      digitalId: profileRow.digitalId || "N/A",
      message: "MPIN reset successfully. You can now log in using your new MPIN.",
    });
  }
}
