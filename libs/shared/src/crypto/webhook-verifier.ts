import * as crypto from 'crypto';
import { logger } from '../logger';

export interface WebhookVerificationOptions {
  /**
   * The raw string or buffer body payload received in the HTTP request.
   */
  payload: string | Buffer;
  /**
   * The signature header value sent by the webhook provider (e.g. 'X-Razorpay-Signature', 'X-Hub-Signature-256').
   */
  signature: string;
  /**
   * The shared secret key used to compute the HMAC signature.
   */
  secret: string;
  /**
   * Optional timestamp sent in headers (e.g. Razorpay or Stripe timestamp) for anti-replay verification.
   */
  timestamp?: number | string;
  /**
   * Maximum allowed clock drift / age tolerance in seconds.
   * Default: 300 seconds (5 minutes). Set to 0 to disable timestamp check.
   */
  toleranceSeconds?: number;
  /**
   * Hashing algorithm. Default: 'sha256'.
   */
  algorithm?: 'sha256' | 'sha1' | 'sha512';
}

/**
 * Low-Level Design (LLD): Enterprise Anti-Replay Webhook Signature Verifier
 * Features:
 * - Constant-Time HMAC Signature Comparison (prevents side-channel timing attacks)
 * - Timestamp drift tolerance check (prevents replay attacks)
 * - Provider-agnostic support for Razorpay, Cashfree, Gupshup, and generic providers
 */
export class WebhookVerifier {
  /**
   * Verifies an incoming webhook payload using constant-time HMAC comparison and timestamp validation.
   */
  public static verifySignature(options: WebhookVerificationOptions): boolean {
    const {
      payload,
      signature,
      secret,
      timestamp,
      toleranceSeconds = 300,
      algorithm = 'sha256',
    } = options;

    if (!payload || !signature || !secret) {
      return false;
    }

    // 1. Anti-Replay Timestamp Verification
    if (timestamp !== undefined && toleranceSeconds > 0) {
      const parsedTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
      
      // Support millisecond and second timestamps
      const timestampInSeconds = parsedTimestamp > 1e11
        ? Math.floor(parsedTimestamp / 1000)
        : parsedTimestamp;

      const currentSeconds = Math.floor(Date.now() / 1000);
      const diff = Math.abs(currentSeconds - timestampInSeconds);

      if (isNaN(diff) || diff > toleranceSeconds) {
        logger.warn({
          msg: '[WebhookVerifier] Webhook rejected: timestamp outside tolerance window',
          diffSeconds: diff,
          toleranceSeconds,
        });
        return false;
      }
    }

    // 2. Compute Expected HMAC Signature
    let dataToSign: string | Buffer;
    if (timestamp !== undefined) {
      const rawPayload = typeof payload === 'string' ? payload : payload.toString('utf8');
      // If signature includes timestamp prefix (e.g. Stripe/Gupshup `t.payload` standard)
      dataToSign = typeof timestamp === 'string' || typeof timestamp === 'number'
        ? `${timestamp}.${rawPayload}`
        : rawPayload;
    } else {
      dataToSign = payload;
    }

    const computedSignature = crypto
      .createHmac(algorithm, secret)
      .update(dataToSign)
      .digest('hex');

    // Clean signature (remove algorithm prefix like 'sha256=' or 'v1=' if provided)
    let cleanSignature = signature.trim();
    if (cleanSignature.includes('=')) {
      cleanSignature = cleanSignature.split('=').pop()!;
    }

    // 3. Constant-Time Timing Safe Comparison
    const computedBuffer = Buffer.from(computedSignature, 'utf8');
    const signatureBuffer = Buffer.from(cleanSignature, 'utf8');

    if (computedBuffer.length !== signatureBuffer.length) {
      // Fallback check against raw payload without timestamp prefix if direct body signing was used
      if (timestamp !== undefined) {
        const directComputed = crypto.createHmac(algorithm, secret).update(payload).digest('hex');
        const directBuf = Buffer.from(directComputed, 'utf8');
        if (directBuf.length === signatureBuffer.length && crypto.timingSafeEqual(directBuf, signatureBuffer)) {
          return true;
        }
      }
      return false;
    }

    return crypto.timingSafeEqual(computedBuffer, signatureBuffer);
  }
}
