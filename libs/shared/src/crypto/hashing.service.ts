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
}
