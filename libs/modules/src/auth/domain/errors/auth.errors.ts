import { BaseDomainError } from "@vishwakarma-k-c/shared";

/**
 * Auth Module Specific Errors
 */

export class InvalidOtpError extends BaseDomainError {
  public readonly code = "INVALID_OTP";
  constructor(metadata?: Record<string, unknown>) {
    super("The provided OTP is invalid or has expired", metadata);
  }
}

export class ExpiredOtpError extends BaseDomainError {
  public readonly code = "EXPIRED_OTP";
  constructor(metadata?: Record<string, unknown>) {
    super("The OTP has expired. Please request a new one.", metadata);
  }
}

export class TooManyAttemptsError extends BaseDomainError {
  public readonly code = "TOO_MANY_ATTEMPTS";
  constructor(metadata?: Record<string, unknown>) {
    super("Too many failed attempts. Identity locked temporarily.", metadata);
  }
}

export class IdentityAlreadyExistsError extends BaseDomainError {
  public readonly code = "IDENTITY_ALREADY_EXISTS";
  constructor(identifier: string) {
    super(`Identity with identifier ${identifier} already exists`, { identifier });
  }
}

export class UserNotFoundError extends BaseDomainError {
  public readonly code = "USER_NOT_FOUND";
  constructor(userId: string | number) {
    super(`User with ID ${userId} not found`, { userId });
  }
}
