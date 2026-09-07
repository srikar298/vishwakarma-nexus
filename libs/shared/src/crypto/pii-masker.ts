/**
 * Low-Level Design (LLD): Enterprise PII Data Masking Engine
 * Prevents accidental leakage of sensitive personal data (phone numbers, emails, identity IDs)
 * in server logs, API telemetry responses, and debugging traces.
 */
export class PiiMasker {
  private static readonly DEFAULT_SENSITIVE_KEYS = new Set([
    'password',
    'token',
    'secret',
    'refreshtoken',
    'accesstoken',
    'authorization',
    'phone',
    'phonenumber',
    'mobile',
    'email',
    'aadhaar',
    'aadhaarnumber',
    'pan',
    'pannumber',
    'bankaccount',
    'accountnumber',
    'creditcard',
    'cvv',
  ]);

  /**
   * Masks a phone number preserving the country code / initial 2 digits and last 4 digits.
   * Example: '+919876543210' -> '+91 98****3210'
   */
  public static maskPhone(phone: string): string {
    if (!phone) return '';
    const trimmed = phone.trim();
    if (trimmed.length <= 4) return '****';

    const clean = trimmed.replace(/\s+/g, '');
    const isPlus = clean.startsWith('+');
    const startOffset = isPlus ? 4 : 2;
    const prefix = clean.slice(0, startOffset);
    const suffix = clean.slice(-4);
    const maskLen = Math.max(2, clean.length - startOffset - 4);

    return `${prefix}${'*'.repeat(maskLen)}${suffix}`;
  }

  /**
   * Masks an email address preserving first and last char of local part and the full domain.
   * Example: 'rajesh.kumar@gmail.com' -> 'r****r@gmail.com'
   */
  public static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return '****@****';
    const [local, domain] = email.trim().split('@');

    if (local.length <= 2) {
      return `${local[0] || '*'}*@${domain}`;
    }

    const first = local[0];
    const last = local[local.length - 1];
    const maskLen = Math.max(2, local.length - 2);

    return `${first}${'*'.repeat(maskLen)}${last}@${domain}`;
  }

  /**
   * Masks an identifier (e.g. Aadhaar, PAN, Bank Account) showing only last 4 digits.
   * Example: '123456789012' -> '********9012'
   */
  public static maskIdentifier(id: string): string {
    if (!id) return '';
    const clean = id.trim().replace(/[\s-]/g, '');
    if (clean.length <= 4) return '****';

    const suffix = clean.slice(-4);
    const prefixLen = clean.length - 4;
    return `${'*'.repeat(prefixLen)}${suffix}`;
  }

  /**
   * Masks a generic string displaying visible start and end characters.
   */
  public static maskGeneric(val: string, visibleStart = 2, visibleEnd = 2): string {
    if (!val) return '';
    if (val.length <= visibleStart + visibleEnd) return '*'.repeat(val.length);

    const start = val.slice(0, visibleStart);
    const end = val.slice(-visibleEnd);
    const maskLen = val.length - visibleStart - visibleEnd;
    return `${start}${'*'.repeat(maskLen)}${end}`;
  }

  /**
   * Recursively sanitizes an object, masking all sensitive field values.
   */
  public static sanitizeObject(
    obj: any,
    customSensitiveKeys: string[] = [],
    depth = 0
  ): any {
    if (!obj || typeof obj !== 'object' || depth > 5) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item, customSensitiveKeys, depth + 1));
    }

    const sensitiveSet = new Set([
      ...this.DEFAULT_SENSITIVE_KEYS,
      ...customSensitiveKeys.map((k) => k.toLowerCase()),
    ]);

    const result: Record<string, any> = {};

    for (const [key, val] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase().replace(/[^a-z]/g, '');

      if (val === null || val === undefined) {
        result[key] = val;
      } else if (sensitiveSet.has(lowerKey)) {
        if (typeof val === 'string') {
          if (lowerKey.includes('email')) {
            result[key] = this.maskEmail(val);
          } else if (lowerKey.includes('phone') || lowerKey.includes('mobile')) {
            result[key] = this.maskPhone(val);
          } else {
            result[key] = '[REDACTED]';
          }
        } else {
          result[key] = '[REDACTED]';
        }
      } else if (typeof val === 'object') {
        result[key] = this.sanitizeObject(val, customSensitiveKeys, depth + 1);
      } else {
        result[key] = val;
      }
    }

    return result;
  }
}
