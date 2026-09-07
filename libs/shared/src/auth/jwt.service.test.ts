import { describe, it, expect, beforeEach } from 'vitest';
import { JWTService } from './jwt.service';

describe('JWTService Integration Tests', () => {
  const testPayload = {
    userId: 'user-123',
    role: 'SUPER_ADMIN',
  };

  it('should sign and verify a valid access token using signToken alias', async () => {
    const token = await JWTService.signToken(testPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const verifiedPayload = await JWTService.verifyToken(token);
    expect(verifiedPayload).toBeDefined();
    expect(verifiedPayload?.userId).toBe(testPayload.userId);
    expect(verifiedPayload?.role).toBe(testPayload.role);
    expect(verifiedPayload?.id).toBe(testPayload.userId);
  });

  it('should sign and verify refresh tokens', async () => {
    const refreshToken = await JWTService.signRefreshToken({ id: 'user-456' });
    expect(refreshToken).toBeDefined();

    const verified = await JWTService.verifyToken(refreshToken);
    expect(verified).toBeDefined();
    expect(verified?.id).toBe('user-456');
    expect(verified?.type).toBe('refresh');
    expect(verified?.jti).toBeDefined();
  });

  it('should return null for a malformed token', async () => {
    const invalidToken = 'this.is.not.a.token';
    const payload = await JWTService.verifyToken(invalidToken);
    expect(payload).toBeNull();
  });

  it('should reject a token that has been explicitly revoked via jti', async () => {
    const token = await JWTService.signAccessToken({ id: 'user-789', role: 'ADMIN' });
    const verifiedFirst = await JWTService.verifyToken(token);
    expect(verifiedFirst).toBeDefined();
    expect(verifiedFirst?.jti).toBeDefined();

    // Revoke the token using its jti
    await JWTService.revokeToken(verifiedFirst!.jti!, 60);

    // Verification after revocation must return null
    const verifiedAfterRevocation = await JWTService.verifyToken(token);
    expect(verifiedAfterRevocation).toBeNull();
  });
});
