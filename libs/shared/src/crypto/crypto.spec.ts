import { describe, it, expect } from 'vitest';
import { EncryptionService } from './encryption.service';
import { BlindIndexer } from './blind-index';
import { PiiMasker } from './pii-masker';
import { WebhookVerifier } from './webhook-verifier';
import * as crypto from 'crypto';

describe('Component 7: Cryptography, PII Protection & Security Guards', () => {
  describe('EncryptionService (AES-256-GCM + Multi-Key Versioning)', () => {
    it('should encrypt and decrypt plaintext successfully with authenticated integrity', () => {
      const plainText = 'Highly confidential Gotra & Family Lineage record';
      const cipherText = EncryptionService.encrypt(plainText);

      expect(cipherText).toBeDefined();
      expect(cipherText.startsWith('v1:')).toBe(true);

      const decrypted = EncryptionService.decrypt(cipherText);
      expect(decrypted).toBe(plainText);
    });

    it('should support key rotation with multiple key versions (v1 -> v2)', () => {
      // 1. Encrypt with v1
      const plainText = 'Bank Account Number: 1234567890';
      const cipherV1 = EncryptionService.encrypt(plainText, 'v1');
      expect(cipherV1.startsWith('v1:')).toBe(true);

      // 2. Register new key version v2
      const newSecretV2 = 'brand-new-rotated-secret-key-32-chars-long!';
      EncryptionService.registerKey('v2', newSecretV2);
      EncryptionService.setCurrentKeyVersion('v2');

      // 3. Encrypt new payload with v2
      const cipherV2 = EncryptionService.encrypt(plainText);
      expect(cipherV2.startsWith('v2:')).toBe(true);

      // 4. Both v1 and v2 records must decrypt seamlessly without manual version passing
      expect(EncryptionService.decrypt(cipherV1)).toBe(plainText);
      expect(EncryptionService.decrypt(cipherV2)).toBe(plainText);

      // 5. Re-encrypt v1 payload to v2
      const reEncrypted = EncryptionService.reEncrypt(cipherV1, 'v2');
      expect(reEncrypted.startsWith('v2:')).toBe(true);
      expect(EncryptionService.decrypt(reEncrypted)).toBe(plainText);

      // Reset back to v1
      EncryptionService.setCurrentKeyVersion('v1');
    });

    it('should throw an error on tampered ciphertext', () => {
      const plainText = 'Original Data';
      const cipherText = EncryptionService.encrypt(plainText);
      const parts = cipherText.split(':');
      
      // Tamper ciphertext payload
      parts[3] = parts[3].slice(0, -2) + 'aa';
      const tampered = parts.join(':');

      expect(() => EncryptionService.decrypt(tampered)).toThrow();
    });
  });

  describe('BlindIndexer (Exact Search over Encrypted Fields)', () => {
    it('should generate deterministic blind index tokens for exact match queries', () => {
      const phone = '9876543210';
      const token1 = BlindIndexer.generateBlindIndex(phone, 'test-pepper', 'phone');
      const token2 = BlindIndexer.generateBlindIndex(phone, 'test-pepper', 'phone');

      expect(token1).toBeDefined();
      expect(token1).toBe(token2);
    });

    it('should normalize Indian phone numbers with country code or spaces to produce identical tokens', () => {
      const token1 = BlindIndexer.generateBlindIndex('+91 98765-43210', 'test-pepper', 'phone');
      const token2 = BlindIndexer.generateBlindIndex('9876543210', 'test-pepper', 'phone');
      const token3 = BlindIndexer.generateBlindIndex(' 09876543210 ', 'test-pepper', 'phone');

      expect(token1).toBe(token2);
      expect(token2).toBe(token3);
    });

    it('should normalize email addresses to lowercase before computing blind index', () => {
      const token1 = BlindIndexer.generateBlindIndex('User.Name@Example.COM', 'test-pepper', 'email');
      const token2 = BlindIndexer.generateBlindIndex('user.name@example.com', 'test-pepper', 'email');

      expect(token1).toBe(token2);
    });
  });

  describe('PiiMasker (Data Masking & Log Sanitization)', () => {
    it('should mask phone numbers appropriately', () => {
      const masked = PiiMasker.maskPhone('+919876543210');
      expect(masked).toBe('+919*****3210');

      const masked10 = PiiMasker.maskPhone('9876543210');
      expect(masked10).toBe('98****3210');
    });

    it('should mask email addresses appropriately', () => {
      const masked = PiiMasker.maskEmail('rajesh.kumar@gmail.com');
      expect(masked).toBe('r**********r@gmail.com');
    });

    it('should mask identifiers showing only last 4 digits', () => {
      const masked = PiiMasker.maskIdentifier('123456789012');
      expect(masked).toBe('********9012');
    });

    it('should recursively sanitize objects for log safety', () => {
      const sensitiveData = {
        userId: 'u-123',
        password: 'superSecretPassword!',
        email: 'user@example.com',
        nested: {
          mobileNumber: '+919876543210',
          token: 'jwt.token.here',
          publicInfo: 'safe to display',
        },
      };

      const sanitized = PiiMasker.sanitizeObject(sensitiveData);

      expect(sanitized.userId).toBe('u-123');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.email).toContain('@example.com');
      expect(sanitized.nested.mobileNumber).toContain('3210');
      expect(sanitized.nested.token).toBe('[REDACTED]');
      expect(sanitized.nested.publicInfo).toBe('safe to display');
    });
  });

  describe('WebhookVerifier (Anti-Replay & Constant-Time Verification)', () => {
    const secret = 'whsec_test_secret_key_12345';
    const payload = JSON.stringify({ event: 'payment.captured', amount: 50000 });

    it('should verify valid HMAC-SHA256 webhook signatures', () => {
      const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

      const isValid = WebhookVerifier.verifySignature({
        payload,
        signature,
        secret,
      });

      expect(isValid).toBe(true);
    });

    it('should reject tampered webhook payloads', () => {
      const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const tamperedPayload = JSON.stringify({ event: 'payment.captured', amount: 999999 });

      const isValid = WebhookVerifier.verifySignature({
        payload: tamperedPayload,
        signature,
        secret,
      });

      expect(isValid).toBe(false);
    });

    it('should reject webhook requests exceeding timestamp tolerance (Anti-Replay)', () => {
      const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago (tolerance is 300s)
      const dataToSign = `${oldTimestamp}.${payload}`;
      const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');

      const isValid = WebhookVerifier.verifySignature({
        payload,
        signature,
        secret,
        timestamp: oldTimestamp,
        toleranceSeconds: 300,
      });

      expect(isValid).toBe(false);
    });

    it('should accept webhook requests within timestamp tolerance window', () => {
      const currentTimestamp = Math.floor(Date.now() / 1000) - 10; // 10 seconds ago
      const dataToSign = `${currentTimestamp}.${payload}`;
      const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');

      const isValid = WebhookVerifier.verifySignature({
        payload,
        signature,
        secret,
        timestamp: currentTimestamp,
        toleranceSeconds: 300,
      });

      expect(isValid).toBe(true);
    });
  });
});
