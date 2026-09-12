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
import { TokenService, AuthTokens } from "../services/token.service";
import { PhoneNumber } from "../../domain/value-objects/phone-number.vo";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export interface LoginCommand {
  identifier: string; // Phone number or Digital ID (e.g. VKC-2026-104820)
  mpin: string;
}

export interface LoginResult {
  user: {
    publicId: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  profile: {
    digitalId: string;
    phone: string;
    email?: string | null;
    kula: string;
    trade: string;
    district: string;
    mandal?: string | null;
  };
  tokens: AuthTokens;
}

export class LoginUseCase {
  private readonly tokenService: TokenService;
  private static readonly MAX_FAILED_ATTEMPTS = 5;
  private static readonly LOCKOUT_TTL_SECONDS = 15 * 60; // 15 minutes

  constructor(private readonly authRepository: IAuthRepository) {
    this.tokenService = new TokenService(this.authRepository);
  }

  public async execute(command: LoginCommand): Promise<Result<LoginResult, Error>> {
    const { identifier, mpin } = command;
    const trimmedId = identifier.trim();

    let targetUserId: number | null = null;
    let rateLimitKey: string;

    // 1. Dual-Identifier Resolution: Digital ID vs Phone Number
    if (trimmedId.toUpperCase().startsWith("VKC-") || trimmedId.toUpperCase().startsWith("VKC")) {
      rateLimitKey = trimmedId.toUpperCase();
      // Resolution via Digital ID (resilient against phone typos)
      const profileRows = await db
        .select()
        .from(profiles)
        .where(eq(profiles.digitalId, rateLimitKey))
        .limit(1);

      if (profileRows.length === 0) {
        return Result.fail(new DynamicDomainError("INVALID_CREDENTIALS", "Invalid Digital ID or MPIN."));
      }

      targetUserId = profileRows[0].userId;
    } else {
      // Resolution via Mobile Number
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
          return Result.fail(new DynamicDomainError("INVALID_CREDENTIALS", "Invalid phone number or Digital ID."));
        }
      }

      rateLimitKey = normalizedPhone;

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
        return Result.fail(new DynamicDomainError("INVALID_CREDENTIALS", "Invalid phone number or MPIN."));
      }

      targetUserId = identityRows[0].userId;
    }

    // 2. Lockout Defense Check (Prevents Brute-Force Attacks)
    const lockoutKey = `auth:lockout:${rateLimitKey}`;
    const isLocked = await cacheProvider.get(lockoutKey);
    if (isLocked) {
      return Result.fail(
        new DynamicDomainError(
          "ACCOUNT_LOCKED", 
          "Account is temporarily locked due to 5 consecutive failed MPIN attempts. Please wait 15 minutes or reset your MPIN."
        )
      );
    }

    // 3. Fetch User & Primary Phone Identity for Credential Verification
    const [userRow] = await db
      .select()
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);

    if (!userRow) {
      return Result.fail(new DynamicDomainError("INVALID_CREDENTIALS", "Account not found."));
    }

    const [identityRow] = await db
      .select()
      .from(identities)
      .where(
        and(
          eq(identities.userId, targetUserId),
          eq(identities.provider, "PHONE")
        )
      )
      .limit(1);

    if (!identityRow || !identityRow.credentialHash) {
      return Result.fail(
        new DynamicDomainError("CREDENTIALS_NOT_SET", "MPIN not configured for this account. Please register or reset MPIN.")
      );
    }

    // 4. Constant-Time MPIN Verification & Lockout Counter Management
    const attemptsKey = `auth:failed_attempts:${rateLimitKey}`;
    const isMpinValid = HashingService.verifyCredential(mpin, identityRow.credentialHash);
    if (!isMpinValid) {
      const currentAttempts = ((await cacheProvider.get<number>(attemptsKey)) || 0) + 1;
      await cacheProvider.set(attemptsKey, currentAttempts, LoginUseCase.LOCKOUT_TTL_SECONDS);

      if (currentAttempts >= LoginUseCase.MAX_FAILED_ATTEMPTS) {
        await cacheProvider.set(lockoutKey, "LOCKED", LoginUseCase.LOCKOUT_TTL_SECONDS);
        
        await auditLogger.log({
          action: "LOGIN_BRUTE_FORCE_LOCKOUT",
          resourceType: "MEMBER",
          targetId: rateLimitKey,
          userId: userRow.publicId,
          severity: "WARNING",
          metadata: {
            attempts: currentAttempts,
            identifier: rateLimitKey,
          },
        });

        return Result.fail(
          new DynamicDomainError(
            "TOO_MANY_ATTEMPTS",
            "Incorrect MPIN. Maximum of 5 failed attempts reached. Your account is locked for 15 minutes."
          )
        );
      }

      const remaining = LoginUseCase.MAX_FAILED_ATTEMPTS - currentAttempts;
      return Result.fail(
        new DynamicDomainError(
          "INVALID_CREDENTIALS", 
          `Incorrect MPIN. ${remaining} attempt(s) remaining before account lockout.`
        )
      );
    }

    // Clear failed attempts and lockouts upon successful login
    await Promise.all([
      cacheProvider.delete(attemptsKey),
      cacheProvider.delete(lockoutKey),
    ]);

    // 5. Fetch Associated Profile
    const [profileRow] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, targetUserId))
      .limit(1);

    // 5. Issue JWT Session Tokens
    const tokens = await this.tokenService.issueAuthTokens({
      publicId: userRow.publicId,
      role: userRow.role,
    });

    // 6. Update Last Login Timestamp
    await db
      .update(identities)
      .set({ lastLoginAt: new Date() })
      .where(eq(identities.id, identityRow.id));

    logger.info({
      msg: "Member Logged In Successfully",
      publicId: userRow.publicId,
      digitalId: profileRow?.digitalId,
    });

    return Result.ok({
      user: {
        publicId: userRow.publicId,
        firstName: userRow.firstName || "",
        lastName: userRow.lastName || "",
        role: userRow.role,
      },
      profile: {
        digitalId: profileRow?.digitalId || "N/A",
        phone: profileRow?.phone || identityRow.identifier,
        email: profileRow?.email,
        kula: profileRow?.kula || "General",
        trade: profileRow?.trade || "General",
        district: profileRow?.district || "General",
        mandal: profileRow?.mandal,
      },
      tokens,
    });
  }
}
