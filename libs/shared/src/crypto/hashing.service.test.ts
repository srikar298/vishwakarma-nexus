import { describe, it, expect } from 'vitest';
import { HashingService } from './hashing.service';

describe('HashingService Unit Tests', () => {
  it('should generate a SHA-256 hash', () => {
    const hash = HashingService.sha256('hello-vishwakarma');
    expect(hash).toBeDefined();
    expect(hash).toHaveLength(64);
  });

  it('should generate an HMAC-SHA256 signature', () => {
    const hmac = HashingService.hmacSha256('message', 'secret-key');
    expect(hmac).toBeDefined();
    expect(hmac).toHaveLength(64);
  });

  it('should perform timing-safe string comparison correctly', () => {
    const a = 'abcdef123456';
    const b = 'abcdef123456';
    const c = 'abcdef123457';
    const d = 'abcdef';

    expect(HashingService.timingSafeEqual(a, b)).toBe(true);
    expect(HashingService.timingSafeEqual(a, c)).toBe(false);
    expect(HashingService.timingSafeEqual(a, d)).toBe(false);
  });

  it('should hash credentials using salted scrypt and verify successfully', () => {
    const pin = '1234';
    const storedHash = HashingService.hashCredential(pin);

    expect(storedHash).toContain(':');
    const [salt, key] = storedHash.split(':');
    expect(salt).toHaveLength(32); // 16 bytes hex
    expect(key).toHaveLength(128); // 64 bytes hex

    // Correct PIN verification
    expect(HashingService.verifyCredential('1234', storedHash)).toBe(true);

    // Incorrect PIN verification
    expect(HashingService.verifyCredential('1235', storedHash)).toBe(false);
    expect(HashingService.verifyCredential('0000', storedHash)).toBe(false);
  });

  it('should generate distinct salt hashes for identical credentials', () => {
    const pin = '5678';
    const hash1 = HashingService.hashCredential(pin);
    const hash2 = HashingService.hashCredential(pin);

    expect(hash1).not.toBe(hash2);
    expect(HashingService.verifyCredential(pin, hash1)).toBe(true);
    expect(HashingService.verifyCredential(pin, hash2)).toBe(true);
  });

  it('should reject malformed stored hash gracefully', () => {
    expect(HashingService.verifyCredential('1234', 'malformed-hash-without-salt')).toBe(false);
    expect(HashingService.verifyCredential('1234', '')).toBe(false);
  });
});
