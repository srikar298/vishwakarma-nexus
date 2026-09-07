import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";
import { OtpCode } from "../../domain/value-objects/otp-code.vo";
import { PhoneNumber } from "../../domain/value-objects/phone-number.vo";
import { cacheProvider, logger, Result, DynamicDomainError } from "@vishwakarma-k-c/shared";

export interface RequestOtpCommand {
  identifier: string;
  provider: "PHONE" | "EMAIL";
  reason: "LOGIN" | "REGISTER";
}

export class RequestOtpUseCase {
  constructor(
    private readonly authRepository: IAuthRepository
  ) {}

  public async execute(command: RequestOtpCommand): Promise<Result<void, Error>> {
    const { identifier, provider, reason } = command;
    let finalIdentifier = identifier;

    // 1. Domain Validation & Normalization
    if (provider === "PHONE") {
      try {
        finalIdentifier = new PhoneNumber(identifier).toString();
      } catch (err) {
        return Result.fail(err as Error);
      }
    }

    // 2. Identity Throttling (Internal Defense)
    // Prevents sending many OTPs to same user even if Idempotency-Key is bypassed
    const throttleKey = `auth:throttle:${finalIdentifier}`;
    const isThrottled = await cacheProvider.get(throttleKey);
    if (isThrottled) {
      return Result.fail(new DynamicDomainError("TOO_MANY_REQUESTS", "Please wait 60 seconds before requesting another OTP."));
    }

    // 3. Resolve Identity
    const identity = await this.authRepository.findByIdentifier(provider, finalIdentifier);
    
    // Security check: Don't reveal if user exists for LOGIN/REGISTER (Mitigates User Enumeration)
    // However, for this specific flow, we might return different messages or just proceed.
    // Standard Enterprise practice is to proceed and pretend it was sent.
    
    // 4. Generate OTP
    const otp = OtpCode.generate(6);
    const hash = otp.getHash();

    // 5. Store in Redis with Jittered TTL (mitigates "Cache Avalanche")
    const baseTTL = 10 * 60; // 10 minutes
    const jitter = Math.floor(Math.random() * 60) - 30; // +/- 30 seconds
    const ttl = baseTTL + jitter;

    // Key format: auth:otp:<identifier>:<reason>
    const cacheKey = `auth:otp:${finalIdentifier}:${reason}`;
    await cacheProvider.set(cacheKey, { hash, attempts: 0 }, ttl);
    
    // Set 60s throttle
    await cacheProvider.set(throttleKey, "LOCKED", 60);

    // 6. Messaging Integration (Mocked)
    // In production, this would call FirebaseService or an SMS gateway
    logger.info({ 
      msg: "[AUTH] OTP Generated", 
      target: finalIdentifier, 
      otp: otp.getRaw(), // ONLY in development!
      reason 
    });

    return Result.ok();
  }
}
