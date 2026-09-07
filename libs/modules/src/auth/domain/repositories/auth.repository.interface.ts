import { User, Identity, UserId, IdentityId } from "../entities/user-identity.entity";
import { OtpCode } from "../value-objects/otp-code.vo";

/**
 * Authentication & Identity Repository Interface
 */
export interface IAuthRepository {
  findByIdentifier(provider: string, identifier: string): Promise<Identity | null>;
  findUserById(userId: UserId): Promise<User | null>;
  findByPublicId(publicId: string): Promise<User | null>;
  createUser(role: string): Promise<User>;
  createIdentity(userId: UserId, provider: string, identifier: string): Promise<Identity>;
  updateIdentity(identity: Identity): Promise<void>;
  updateUser(user: User): Promise<void>;
  mergeAccounts(sourceUserId: UserId, targetUserId: UserId): Promise<void>;
}

/**
 * Verification Repository Interface (OTP)
 */
export interface IVerificationRepository {
  upsert(identityId: IdentityId, purpose: string, code: OtpCode, expiresAt: Date): Promise<void>;
  findByIdentityId(identityId: IdentityId, purpose: string): Promise<{ codeHash: string, attempts: number, expiresAt: Date } | null>;
  incrementAttempts(identityId: IdentityId, purpose: string): Promise<number>;
  delete(identityId: IdentityId, purpose: string): Promise<void>;
}

/**
 * Token Repository Interface (Refresh Tokens)
 */
export interface ITokenRepository {
  store(userId: UserId, token: string, expiresAt: Date): Promise<void>;
  find(token: string): Promise<{ userId: UserId, expiresAt: Date, isRevoked: boolean } | null>;
  revoke(token: string): Promise<void>;
  revokeAllForUser(userId: UserId): Promise<void>;
}
