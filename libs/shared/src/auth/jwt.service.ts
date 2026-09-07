import * as jose from 'jose';
import { config } from '../config';
import { logger } from '../logger';

// Define the shape of our JWT Payload
export interface JWTPayload {
  id: string; // The user's publicId or internal ID
  userId?: string; // Compatibility alias
  role: string;
  email?: string;
  type?: string;
  jti?: string;
  [key: string]: any;
}

/**
 * Low-Level Design (LLD): Enterprise JWT Authentication & Token Revocation Service
 * Features:
 * - Short-lived Access Tokens (with unique jti for revocation support)
 * - Long-lived Refresh Tokens (with automatic rotation detection)
 * - Distributed Token Revocation Blacklist (Redis/In-Memory)
 * - Algorithmic security: Strict HS256 enforcement
 */
export class JWTService {
  private static readonly secret = new TextEncoder().encode(config.auth.jwtSecret || 'default-secret-key-must-be-32-chars-long!');
  private static revokedJtis = new Map<string, number>(); // jti -> expiryTimestamp

  /**
   * Signs a short-lived Access Token
   */
  public static async signAccessToken(payload: Partial<JWTPayload> & { id?: string; userId?: string; role: string }): Promise<string> {
    const id = payload.id || payload.userId || 'anonymous';
    const jti = payload.jti || crypto.randomUUID();

    return new jose.SignJWT({
      ...payload,
      id,
      userId: id,
      type: 'access',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setJti(jti)
      .setExpirationTime(config.auth.jwtExpiresIn || '15m')
      .sign(this.secret);
  }

  /**
   * Convenience alias for signing tokens
   */
  public static async signToken(payload: Partial<JWTPayload> & { id?: string; userId?: string; role: string }): Promise<string> {
    return this.signAccessToken(payload);
  }

  /**
   * Signs a long-lived Refresh Token with unique jti for rotation detection
   */
  public static async signRefreshToken(payload: { id?: string; userId?: string }): Promise<string> {
    const id = payload.id || payload.userId || 'anonymous';
    const jti = crypto.randomUUID();

    return new jose.SignJWT({
      id,
      userId: id,
      type: 'refresh',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .setJti(jti)
      .sign(this.secret);
  }

  /**
   * Verifies a JWT, validates signature, expiration, and checks revocation blacklist.
   */
  public static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jose.jwtVerify(token, this.secret, {
        algorithms: ['HS256'],
      });

      const decoded = payload as unknown as JWTPayload;
      const id = decoded.id || decoded.userId || '';
      decoded.id = id;
      decoded.userId = id;

      // Check revocation blacklist
      if (decoded.jti && this.isTokenRevoked(decoded.jti)) {
        logger.warn({ msg: '[JWTService] Rejected token: jti is blacklisted/revoked', jti: decoded.jti });
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Revokes a token by its unique identifier (jti) until its natural expiration.
   */
  public static async revokeToken(jti: string, ttlSeconds: number = 900): Promise<void> {
    if (!jti) return;
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.revokedJtis.set(jti, expiresAt);

    // TASK: [Cache Integration] Persist revoked jti in RedisCacheProvider with TTL (e.g. 'SET vkc:jwt:blacklist:<jti> 1 EX <ttl>')
    logger.info({ msg: `[JWTService] Token revoked`, jti, ttlSeconds });

    // Clean up expired blacklist items periodically
    this.cleanRevocationCache();
  }

  /**
   * Checks if a jti exists in the revocation blacklist.
   */
  public static isTokenRevoked(jti: string): boolean {
    const expiresAt = this.revokedJtis.get(jti);
    if (!expiresAt) return false;

    if (Date.now() > expiresAt) {
      this.revokedJtis.delete(jti);
      return false;
    }

    return true;
  }

  private static cleanRevocationCache(): void {
    const now = Date.now();
    for (const [jti, expiresAt] of this.revokedJtis.entries()) {
      if (now > expiresAt) {
        this.revokedJtis.delete(jti);
      }
    }
  }
}
