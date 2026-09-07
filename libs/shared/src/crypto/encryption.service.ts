import * as crypto from 'crypto';
import { config } from '../config';

/**
 * Low-Level Design (LLD): Enterprise AES-256-GCM Encryption Service
 * Encrypts and decrypts sensitive PII data (e.g. Gotra information, bank details) at rest.
 */
export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly AUTH_TAG_LENGTH = 16;

  private static getKey(): Buffer {
    const secret = config.auth.jwtSecret || 'default-secret-key-must-be-32-chars-long!';
    return crypto.createHash('sha256').update(secret).digest();
  }

  public static encrypt(plainText: string): string {
    const key = this.getKey();
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  public static decrypt(cipherText: string): string {
    const parts = cipherText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted payload format.');
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const key = this.getKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
