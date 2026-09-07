import { IStorageProvider, UploadOptions, UploadResult } from '../interfaces/storage-provider.interface';
import { promises as fs } from 'fs';
import * as path from 'path';
import { logger } from '../../logger';

/**
 * Low-Level Design (LLD): Local Disk Storage Provider
 * Safe file system storage for development and testing.
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

  public async upload(key: string, data: Buffer | Uint8Array | string, options?: UploadOptions): Promise<UploadResult> {
    const filePath = path.join(this.baseDir, key);
    await this.ensureDir(filePath);

    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    await fs.writeFile(filePath, buffer);

    logger.info({ key, size: buffer.length }, 'LocalStorageProvider: File saved');

    return {
      key,
      url: `${this.baseUrl}/${key.replace(/\\/g, '/')}`,
      sizeBytes: buffer.length,
    };
  }

  public async getSignedUrl(key: string): Promise<string> {
    return `${this.baseUrl}/${key.replace(/\\/g, '/')}`;
  }

  public async delete(key: string): Promise<boolean> {
    const filePath = path.join(this.baseDir, key);
    try {
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    const filePath = path.join(this.baseDir, key);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
