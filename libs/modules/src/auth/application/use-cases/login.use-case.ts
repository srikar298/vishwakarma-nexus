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

    let rateLimitKey: string;

    // 1. Dual-Identifier Resolution: Digital ID vs Phone Number
    if (trimmedId.toUpperCase().startsWith("VKC-") || trimmedId.toUpperCase().startsWith("VKC")) {
      rateLimitKey = trimmedId.toUpperCase();
    } else {
      // Resolution via Mobile Number
      try {
        rateLimitKey = new PhoneNumber(trimmedId).toString();
      } catch {
        const cleaned = trimmedId.replace(/\D/g, "");
        if (cleaned.length === 10) {
          rateLimitKey = `+91${cleaned}`;
        } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
          rateLimitKey = `+${cleaned}`;
        } else {
          return Result.fail(new DynamicDomainError("INVALID_CREDENTIALS", "Invalid credentials. Please verify and try again."));
        }
      }
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

    // 3. Hot-Path Single Composite JOIN Query (1 DB Round-Trip for User + Identity + Profile)
    let rows: any[];
    if (rateLimitKey.startsWith("VKC")) {
      rows = await db
        .select({
          userId: users.id,
          userPublicId: users.publicId,
          firstName: users.firstName,
          lastName: users.lastName,
          role: users.role,
          identityId: identities.id,
          identifier: identities.identifier,
          credentialHash: identities.credentialHash,
          digitalId: profiles.digitalId,
          phone: profiles.phone,
          email: profiles.email,
          kula: profiles.kula,
          trade: profiles.trade,
          district: profiles.district,
          mandal: profiles.mandal,
        })
        .from(profiles)
        .innerJoin(users, eq(users.id, profiles.userId))
        .innerJoin(
          identities,
          and(
            eq(identities.userId, users.id),
            eq(identities.provider, "PHONE")
          )
        )
        .where(eq(profiles.digitalId, rateLimitKey))
        .limit(1);
    } else {
      rows = await db
        .select({
          userId: users.id,
          userPublicId: users.publicId,
          firstName: users.firstName,
          lastName: users.lastName,
          role: users.role,
          identityId: identities.id,
          identifier: identities.identifier,
          credentialHash: identities.credentialHash,
          digitalId: profiles.digitalId,
          phone: profiles.phone,
          email: profiles.email,
          kula: profiles.kula,
          trade: profiles.trade,
          district: profiles.district,
          mandal: profiles.mandal,
        })
        .from(identities)
        .innerJoin(users, eq(users.id, identities.userId))
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .where(
          and(
            eq(identities.provider, "PHONE"),
            eq(identities.identifier, rateLimitKey)
          )
        )
        .limit(1);
    }

    const memberRow = rows[0];

    // Anti-Enumeration & Constant-Time Timing Oracle Defense:
    // If account does not exist or credential not set, execute dummy scrypt verification to equalize timing
    if (!memberRow || !memberRow.credentialHash) {
      HashingService.verifyCredential(mpin, "dummysalt12345678:dummyhash12345678");

      const attemptsKey = `auth:failed_attempts:${rateLimitKey}`;
      const currentAttempts = ((await cacheProvider.get<number>(attemptsKey)) || 0) + 1;
      await cacheProvider.set(attemptsKey, currentAttempts, LoginUseCase.LOCKOUT_TTL_SECONDS);

      if (currentAttempts >= LoginUseCase.MAX_FAILED_ATTEMPTS) {
        await cacheProvider.set(lockoutKey, "LOCKED", LoginUseCase.LOCKOUT_TTL_SECONDS);
        return Result.fail(
          new DynamicDomainError(
            "ACCOUNT_LOCKED", 
            "Account is temporarily locked due to 5 consecutive failed MPIN attempts. Please wait 15 minutes or reset your MPIN."
          )
        );
      }

      return Result.fail(new DynamicDomainError("INVALID_CREDENTIALS", "Invalid phone number, Digital ID, or MPIN."));
    }

    // 4. Constant-Time MPIN Verification & Lockout Counter Management
    const attemptsKey = `auth:failed_attempts:${rateLimitKey}`;
    const isMpinValid = HashingService.verifyCredential(mpin, memberRow.credentialHash);
    if (!isMpinValid) {
      const currentAttempts = ((await cacheProvider.get<number>(attemptsKey)) || 0) + 1;
      await cacheProvider.set(attemptsKey, currentAttempts, LoginUseCase.LOCKOUT_TTL_SECONDS);

      if (currentAttempts >= LoginUseCase.MAX_FAILED_ATTEMPTS) {
        await cacheProvider.set(lockoutKey, "LOCKED", LoginUseCase.LOCKOUT_TTL_SECONDS);
        
        await auditLogger.log({
          action: "LOGIN_BRUTE_FORCE_LOCKOUT",
          resourceType: "MEMBER",
          targetId: rateLimitKey,
          userId: memberRow.userPublicId,
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

    // 5. Issue JWT Session Tokens
    const tokens = await this.tokenService.issueAuthTokens({
      publicId: memberRow.userPublicId,
      role: memberRow.role,
    });

    // 6. Asynchronous Non-Blocking lastLoginAt Update (Fire-and-forget to eliminate HTTP blocking)
    db.update(identities)
      .set({ lastLoginAt: new Date() })
      .where(eq(identities.id, memberRow.identityId))
      .catch((err: any) => {
        logger.warn({ err: err?.message }, "Non-critical: Failed to record lastLoginAt");
      });

    logger.info({
      msg: "Member Logged In Successfully",
      publicId: memberRow.userPublicId,
      digitalId: memberRow.digitalId,
    });

    return Result.ok({
      user: {
        publicId: memberRow.userPublicId,
        firstName: memberRow.firstName || "",
        lastName: memberRow.lastName || "",
        role: memberRow.role,
      },
      profile: {
        digitalId: memberRow.digitalId || "N/A",
        phone: memberRow.phone || memberRow.identifier,
        email: memberRow.email,
        kula: memberRow.kula || "General",
        trade: memberRow.trade || "General",
        district: memberRow.district || "General",
        mandal: memberRow.mandal,
      },
      tokens,
    });
  }
}
