import * as crypto from 'crypto';
import { config } from '../config';
import { logger } from '../logger';

export interface KeyRegistry {
  [version: string]: Buffer;
}

/**
 * Low-Level Design (LLD): Enterprise AES-256-GCM Envelope Encryption Service
 * Features:
 * - Multi-Key Versioning (v1, v2, etc.) supporting seamless key rotation
 * - Backward compatibility with legacy unversioned ciphertexts
 * - Re-encryption helper for batch database key rotation migrations
 * - Authenticated AES-256-GCM encryption with 128-bit authentication tag
 */
export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly AUTH_TAG_LENGTH = 16;
  private static currentKeyVersion = 'v1';
  private static keyStore = new Map<string, Buffer>();

  static {
    // Initialize default primary key from configuration
    const defaultSecret = config.auth.jwtSecret || 'default-secret-key-must-be-32-chars-long!';
    const defaultKey = crypto.createHash('sha256').update(defaultSecret).digest();
    this.keyStore.set('v1', defaultKey);
  }

  /**
   * Registers a specific key version in the runtime key registry.
   * Enables rotating to a new primary key without breaking decryption of existing data.
   */
  public static registerKey(version: string, keySecret: string | Buffer): void {
    const key = typeof keySecret === 'string'
      ? crypto.createHash('sha256').update(keySecret).digest()
      : keySecret;
    
    if (key.length !== 32) {
      throw new Error(`[EncryptionService] Invalid AES-256 key length: expected 32 bytes, got ${key.length}`);
    }

    this.keyStore.set(version, key);
  }

  /**
   * Sets the active key version used for newly encrypted payloads.
   */
  public static setCurrentKeyVersion(version: string): void {
    if (!this.keyStore.has(version)) {
      throw new Error(`[EncryptionService] Cannot set current key version "${version}": Key not registered in key store`);
    }
    this.currentKeyVersion = version;
  }

  /**
   * Retrieves the current primary encryption key.
   */
  private static getKey(version: string = this.currentKeyVersion): Buffer {
    const key = this.keyStore.get(version);
    if (!key) {
      // TASK: [Audit Integration] Log unknown key version lookup attempt as security alert
      throw new Error(`[EncryptionService] Encryption key version "${version}" not found in key registry`);
    }
    return key;
  }

  /**
   * Encrypts plaintext using AES-256-GCM with authenticated tag and version prefix.
   * Format: `v{version}:{iv_hex}:{authTag_hex}:{ciphertext_hex}`
   */
  public static encrypt(plainText: string, version: string = this.currentKeyVersion): string {
    const key = this.getKey(version);
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    return `${version}:${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypts ciphertext, automatically detecting the key version.
   * Supports both versioned (`v1:iv:tag:ciphertext`) and legacy (`iv:tag:ciphertext`).
   */
  public static decrypt(cipherText: string): string {
    const parts = cipherText.split(':');
    let version = 'v1';
    let ivHex: string;
    let authTagHex: string;
    let encryptedHex: string;

    if (parts.length === 4) {
      // Versioned format: [version, ivHex, authTagHex, encryptedHex]
      [version, ivHex, authTagHex, encryptedHex] = parts;
    } else if (parts.length === 3) {
      // Legacy unversioned format: [ivHex, authTagHex, encryptedHex]
      [ivHex, authTagHex, encryptedHex] = parts;
    } else {
      // TASK: [Audit Integration] Log malformed ciphertext decryption attempt
      throw new Error('[EncryptionService] Invalid encrypted payload format');
    }

    try {
      const key = this.getKey(version);
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      if (iv.length !== this.IV_LENGTH || authTag.length !== this.AUTH_TAG_LENGTH) {
        throw new Error('[EncryptionService] Invalid IV or Auth Tag length');
      }

      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (err: any) {
      logger.error({ msg: `[EncryptionService] Decryption failed`, error: err.message, version });
      throw new Error(`[EncryptionService] Failed to decrypt payload: ${err.message}`);
    }
  }

  /**
   * Re-encrypts an existing ciphertext to the latest/target key version.
   * Useful for background key rotation jobs.
   */
  public static reEncrypt(cipherText: string, targetVersion: string = this.currentKeyVersion): string {
    const decrypted = this.decrypt(cipherText);
    return this.encrypt(decrypted, targetVersion);
  }
}
