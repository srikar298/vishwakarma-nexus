import * as crypto from 'crypto';
import { config } from '../config';

export type BlindIndexNormalizationType = 'phone' | 'email' | 'id' | 'generic';

/**
 * Low-Level Design (LLD): Enterprise Blind Indexing Engine
 * Enables exact-match PostgreSQL querying over encrypted PII fields (e.g. phone, email, Aadhaar)
 * without decrypting rows in memory or exposing plaintext data to database query logs.
 */
export class BlindIndexer {
  private static readonly DEFAULT_PEPPER = config.auth.jwtSecret || 'default-vkc-blind-index-pepper-2026';

  /**
   * Normalizes raw user input into canonical format prior to hashing.
   * Ensures ' +91 98765-43210 ' and '9876543210' produce identical index hashes.
   */
  public static normalize(value: string, type: BlindIndexNormalizationType = 'generic'): string {
    if (!value) return '';

    const trimmed = value.trim();

    switch (type) {
      case 'phone': {
        // Strip non-digits and normalize +91/0 prefix for Indian telephone numbers
        let digits = trimmed.replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('91')) {
          digits = digits.slice(2);
        } else if (digits.length === 11 && digits.startsWith('0')) {
          digits = digits.slice(1);
        }
        return digits;
      }

      case 'email': {
        return trimmed.toLowerCase();
      }

      case 'id': {
        // E.g. Aadhaar, PAN, Voter ID (strip spaces and uppercase)
        return trimmed.replace(/[\s-]/g, '').toUpperCase();
      }

      case 'generic':
      default: {
        return trimmed.toLowerCase();
      }
    }
  }

  /**
   * Generates a deterministic HMAC-SHA256 blind index hash for exact-match database lookups.
   */
  public static generateBlindIndex(
    value: string,
    pepper: string = this.DEFAULT_PEPPER,
    type: BlindIndexNormalizationType = 'generic'
  ): string {
    const normalized = this.normalize(value, type);
    if (!normalized) return '';

    // TASK: [Database Integration] Store in dedicated index column (e.g. phone_blind_index) with b-tree index
    return crypto.createHmac('sha256', pepper).update(normalized).digest('hex');
  }
}
