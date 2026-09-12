import * as crypto from 'crypto';

export class HashingService {
  public static sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  public static hmacSha256(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  public static timingSafeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }

  /**
   * Hashes a password or MPIN using Node.js scrypt with a cryptographically secure 16-byte salt.
   * Output format: salt:derivedKey (hex)
   */
  public static hashCredential(credential: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(credential, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  /**
   * Verifies a password or MPIN against a stored salt:hash string using constant-time comparison.
   */
  public static verifyCredential(credential: string, storedHash: string): boolean {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    const [salt, originalHash] = parts;
    const derivedKey = crypto.scryptSync(credential, salt, 64);
    return this.timingSafeEqual(derivedKey.toString('hex'), originalHash);
  }
}
