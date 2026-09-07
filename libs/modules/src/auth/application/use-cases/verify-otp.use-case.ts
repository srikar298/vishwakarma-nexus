import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";
import { OtpCode } from "../../domain/value-objects/otp-code.vo";
import { TokenService, AuthTokens } from "../services/token.service";
import { PhoneNumber } from "../../domain/value-objects/phone-number.vo";
import { cacheProvider, Result, DynamicDomainError, logger } from "@vishwakarma-k-c/shared";

export interface VerifyOtpCommand {
  identifier: string;
  code: string;
  provider: "PHONE" | "EMAIL";
  reason: "LOGIN" | "REGISTER";
}

export class VerifyOtpUseCase {
  private readonly tokenService: TokenService;

  constructor(
    private readonly authRepository: IAuthRepository
  ) {
    this.tokenService = new TokenService(this.authRepository);
  }

  public async execute(command: VerifyOtpCommand): Promise<Result<AuthTokens | { registerRequired: boolean, identifier: string }, Error>> {
    const { identifier, code, provider, reason } = command;
    let finalIdentifier = identifier;

    if (provider === "PHONE") {
      try {
        finalIdentifier = new PhoneNumber(identifier).toString();
      } catch (err) {
        return Result.fail(err as Error);
      }
    }

    // 1. Fetch Verification State from Redis
    const cacheKey = `auth:otp:${finalIdentifier}:${reason}`;
    const verification = await cacheProvider.get<{ hash: string, attempts: number }>(cacheKey);
    
    if (!verification) {
      return Result.fail(new DynamicDomainError("EXPIRED_OTP", "OTP has expired or does not exist."));
    }

    // 2. Brute Force Protection
    if (verification.attempts >= 5) {
      await cacheProvider.delete(cacheKey);
      return Result.fail(new DynamicDomainError("TOO_MANY_ATTEMPTS", "Too many failed attempts. Identity locked for 1 hour."));
    }

    // 3. Verify Code
    try {
      const incomingOtp = OtpCode.fromRaw(code);
      if (!incomingOtp.verify(verification.hash)) {
        verification.attempts = (verification.attempts || 0) + 1;
        await cacheProvider.set(cacheKey, verification, 5 * 60);
        return Result.fail(new DynamicDomainError("INVALID_OTP", `Invalid OTP code. ${5 - verification.attempts} attempts remaining.`));
      }
    } catch (err) {
      return Result.fail(new DynamicDomainError("INVALID_OTP", "Invalid OTP format."));
    }

    // 4. Cleanup Redis
    await cacheProvider.delete(cacheKey);

    // 5. Success Flow: Resolve Identity
    let identity = await this.authRepository.findByIdentifier(provider, finalIdentifier);
    
    if (!identity) {
      if (reason === "REGISTER") {
        // Create Skeleton User + Identity
        const skeletonUser = await this.authRepository.createUser("MEMBER_BASIC" as any);
        identity = await this.authRepository.createIdentity(skeletonUser.id, provider, finalIdentifier);
        
        logger.info({ userId: skeletonUser.publicId }, "New user skeleton created via OTP registration.");
        return Result.ok({ registerRequired: true, identifier: finalIdentifier });
      }
      
      return Result.fail(new DynamicDomainError("NOT_FOUND", "Identity not found. Please register first."));
    }

    // 6. Issue Tokens for existing user
    const user = await this.authRepository.findUserById(identity.userId);
    if (!user) {
      return Result.fail(new DynamicDomainError("INTERNAL_ERROR", "User profile missing for verified identity."));
    }

    const tokens = await this.tokenService.issueAuthTokens({
      publicId: user.publicId,
      role: user.role
    });

    // Record login
    identity.recordLogin();
    await this.authRepository.updateIdentity(identity);

    logger.info({ userId: user.publicId }, "Successfully verified OTP and issued tokens.");
    return Result.ok(tokens);
  }
}
