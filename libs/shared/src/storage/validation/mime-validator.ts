/**
 * Low-Level Design (LLD): Enterprise Magic Byte MIME Sniffer & Security Validator
 * Inspects binary file signatures (Magic Bytes) to determine the true MIME type,
 * defeating file extension spoofing attacks (e.g. .exe or .php renamed to .jpg).
 */
export class MimeValidator {
  /**
   * Magic byte signatures mapped to standard MIME types
   */
  private static readonly SIGNATURES: Array<{ mime: string; matches: (buf: Buffer) => boolean }> = [
    {
      mime: 'image/jpeg',
      matches: (buf: Buffer) => buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff,
    },
    {
      mime: 'image/png',
      matches: (buf: Buffer) =>
        buf.length >= 8 &&
        buf[0] === 0x89 &&
        buf[1] === 0x50 &&
        buf[2] === 0x4e &&
        buf[3] === 0x47 &&
        buf[4] === 0x0d &&
        buf[5] === 0x0a &&
        buf[6] === 0x1a &&
        buf[7] === 0x0a,
    },
    {
      mime: 'image/webp',
      matches: (buf: Buffer) =>
        buf.length >= 12 &&
        buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buf.subarray(8, 12).toString('ascii') === 'WEBP',
    },
    {
      mime: 'image/gif',
      matches: (buf: Buffer) =>
        buf.length >= 6 &&
        buf.subarray(0, 4).toString('ascii') === 'GIF8' &&
        (buf[4] === 0x37 || buf[4] === 0x39) &&
        buf[5] === 0x61,
    },
    {
      mime: 'application/pdf',
      matches: (buf: Buffer) =>
        buf.length >= 4 &&
        buf[0] === 0x25 &&
        buf[1] === 0x50 &&
        buf[2] === 0x44 &&
        buf[3] === 0x46, // '%PDF'
    },
    {
      mime: 'video/mp4',
      matches: (buf: Buffer) =>
        buf.length >= 8 &&
        buf.subarray(4, 8).toString('ascii') === 'ftyp',
    },
    {
      mime: 'application/zip',
      matches: (buf: Buffer) =>
        buf.length >= 4 &&
        buf[0] === 0x50 &&
        buf[1] === 0x4b &&
        buf[2] === 0x03 &&
        buf[3] === 0x04, // 'PK..'
    },
  ];

  /**
   * Inspects binary header bytes and returns the detected MIME type or null.
   */
  public static detectMimeType(data: Buffer | Uint8Array): string | null {
    if (!data || data.length === 0) return null;
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);

    for (const sig of this.SIGNATURES) {
      if (sig.matches(buf)) {
        return sig.mime;
      }
    }

    return null;
  }

  /**
   * Validates binary data against allowed MIME types and max file size limits.
   */
  public static validateFile(
    data: Buffer | Uint8Array,
    allowedMimes: string[],
    maxSizeBytes: number = 10 * 1024 * 1024 // 10 MB default
  ): { isValid: boolean; detectedMime?: string; error?: string } {
    if (!data || data.length === 0) {
      return { isValid: false, error: 'Empty file payload' };
    }

    if (data.length > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size (${(data.length / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed size (${(maxSizeBytes / (1024 * 1024)).toFixed(2)} MB)`,
      };
    }

    const detectedMime = this.detectMimeType(data);

    if (!detectedMime) {
      return {
        isValid: false,
        error: 'Unsupported or unidentifiable file format (magic byte signature missing)',
      };
    }

    if (!allowedMimes.includes(detectedMime)) {
      return {
        isValid: false,
        detectedMime,
        error: `File type [${detectedMime}] is not permitted. Allowed: [${allowedMimes.join(', ')}]`,
      };
    }

    return {
      isValid: true,
      detectedMime,
    };
  }

  /**
   * Helper: Validates common image formats (JPEG, PNG, WebP)
   */
  public static isAllowedImage(data: Buffer | Uint8Array, maxSizeBytes = 5 * 1024 * 1024): boolean {
    const res = this.validateFile(data, ['image/jpeg', 'image/png', 'image/webp'], maxSizeBytes);
    return res.isValid;
  }

  /**
   * Helper: Validates KYC document formats (PDF, JPEG, PNG)
   */
  public static isAllowedDocument(data: Buffer | Uint8Array, maxSizeBytes = 10 * 1024 * 1024): boolean {
    const res = this.validateFile(data, ['application/pdf', 'image/jpeg', 'image/png'], maxSizeBytes);
    return res.isValid;
  }
}
