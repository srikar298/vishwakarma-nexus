import { JWTService, logger, cacheProvider } from "@vishwakarma-k-c/shared";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class TokenService {
  private static readonly REFRESH_TTL = 7 * 24 * 60 * 60; // 7 Days in seconds

  constructor(
    private readonly authRepository: IAuthRepository
  ) {}

  /**
   * Issue a complete pair of tokens (Access + Refresh)
   * Implements Token Rotation Guard via Redis tracking
   */
  public async issueAuthTokens(user: { publicId: string, role: string }): Promise<AuthTokens> {
    const accessToken = await JWTService.signAccessToken({
      id: user.publicId,
      role: user.role,
    });

    const refreshToken = await JWTService.signRefreshToken({
      id: user.publicId
    });

    // 1. Decode JTI to track it
    const decoded = await JWTService.verifyToken(refreshToken);
    if (decoded?.jti) {
      // 2. Track active JTI in Redis (userId -> Set of JTIs)
      const sessionKey = `user_sessions:${user.publicId}`;
      await cacheProvider.addToSet(sessionKey, decoded.jti);
      await cacheProvider.expire(sessionKey, TokenService.REFRESH_TTL);
    }

    return { accessToken, refreshToken };
  }

  /**
   * Rotate Refresh Token
   * If a re-used JTI is detected, it triggers a "Security Alert" and revokes ALL sessions.
   */
  public async rotateRefreshToken(token: string): Promise<AuthTokens | null> {
    const payload = await JWTService.verifyToken(token);
    
    if (!payload || payload.type !== 'refresh' || !payload.jti) {
      return null;
    }

    const sessionKey = `user_sessions:${payload.id}`;
    const activeJTIs = await cacheProvider.getSet(sessionKey);

    // 1. Check for Reuse (Detection of Token Theft)
    if (!activeJTIs.includes(payload.jti)) {
      logger.warn({ userId: payload.id, jti: payload.jti }, "REUSE DETECTED: Refresh token jti not found in active sessions. Possible breach.");
      await this.revokeAllSessions(payload.id);
      return null;
    }

    // 2. Revoke the old JTI
    await cacheProvider.removeFromSet(sessionKey, payload.jti);

    // 3. Issue new pair with latest Identity/Roles
    const user = await this.authRepository.findByPublicId(payload.id);
    if (!user) {
      logger.error({ userId: payload.id }, "User not found during token rotation. Revoking all sessions.");
      await this.revokeAllSessions(payload.id);
      return null;
    }

    return this.issueAuthTokens({ 
      publicId: user.publicId, 
      role: user.role 
    });
  }

  public async revokeAllSessions(userId: string): Promise<void> {
    await cacheProvider.delete(`user_sessions:${userId}`);
    logger.info({ userId }, "All sessions revoked.");
  }
}
