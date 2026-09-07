import {
  FileMetadata,
  IStorageProvider,
  PresignedUploadOptions,
  PresignedUploadResult,
  UploadOptions,
  UploadResult,
} from '../interfaces/storage-provider.interface';
import { MimeValidator } from '../validation/mime-validator';
import { promises as fs } from 'fs';
import * as path from 'path';
import { logger } from '../../logger';

/**
 * Low-Level Design (LLD): Local Disk Storage Provider
 * Safe file system storage and pre-signed URL emulation for development and testing.
 */
export class LocalStorageProvider implements IStorageProvider {
  private baseDir: string;
  private baseUrl: string;

  constructor(baseDir = './uploads', baseUrl = '/uploads') {
    this.baseDir = path.resolve(baseDir);
    this.baseUrl = baseUrl;
  }

  private async ensureDir(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
  }

  public async upload(
    key: string,
    data: Buffer | Uint8Array | string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const cleanKey = key.replace(/^\/+/, '');
    const filePath = path.join(this.baseDir, cleanKey);
    await this.ensureDir(filePath);

    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    await fs.writeFile(filePath, buffer);

    const detectedMime = options.contentType || MimeValidator.detectMimeType(buffer) || 'application/octet-stream';
    logger.info({ key: cleanKey, size: buffer.length, contentType: detectedMime }, '[LocalStorageProvider] File saved');

    return {
      key: cleanKey,
      url: `${this.baseUrl}/${cleanKey.replace(/\\/g, '/')}`,
      sizeBytes: buffer.length,
      contentType: detectedMime,
    };
  }

  public async download(key: string): Promise<Buffer> {
    const cleanKey = key.replace(/^\/+/, '');
    const filePath = path.join(this.baseDir, cleanKey);
    return fs.readFile(filePath);
  }

  public async getPresignedUploadUrl(
    key: string,
    options: PresignedUploadOptions
  ): Promise<PresignedUploadResult> {
    const cleanKey = key.replace(/^\/+/, '');
    const expiresInSeconds = options.expiresInSeconds || 900;
    const uploadUrl = `${this.baseUrl}/direct-upload/${cleanKey.replace(/\\/g, '/')}?expires=${Date.now() + expiresInSeconds * 1000}`;
    const downloadUrl = `${this.baseUrl}/${cleanKey.replace(/\\/g, '/')}`;

    return {
      uploadUrl,
      downloadUrl,
      key: cleanKey,
      expiresInSeconds,
      headers: {
        'Content-Type': options.contentType,
      },
    };
  }

  public async getPresignedDownloadUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    const cleanKey = key.replace(/^\/+/, '');
    return `${this.baseUrl}/${cleanKey.replace(/\\/g, '/')}?expires=${Date.now() + expiresInSeconds * 1000}`;
  }

  public async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    return this.getPresignedDownloadUrl(key, expiresInSeconds);
  }

  public async delete(key: string): Promise<boolean> {
    const cleanKey = key.replace(/^\/+/, '');
    const filePath = path.join(this.baseDir, cleanKey);
    try {
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    const cleanKey = key.replace(/^\/+/, '');
    const filePath = path.join(this.baseDir, cleanKey);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  public async getMetadata(key: string): Promise<FileMetadata | null> {
    const cleanKey = key.replace(/^\/+/, '');
    const filePath = path.join(this.baseDir, cleanKey);

    try {
      const stats = await fs.stat(filePath);
      return {
        key: cleanKey,
        sizeBytes: stats.size,
        contentType: 'application/octet-stream',
        lastModified: stats.mtime,
      };
    } catch {
      return null;
    }
  }
}
