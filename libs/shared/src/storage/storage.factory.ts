import { IStorageProvider } from './interfaces/storage-provider.interface';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { S3StorageProvider } from './providers/s3-storage.provider';
import { logger } from '../logger';

/**
 * Low-Level Design (LLD): Storage Provider Factory
 * Automatically selects S3 / Cloudflare R2 in production/staging environments
 * and falls back to Local Disk Storage during local development and testing.
 */
export class StorageFactory {
  private static instance: IStorageProvider | null = null;

  public static getStorage(): IStorageProvider {
    if (!this.instance) {
      const hasS3Config = process.env.S3_BUCKET && (process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID);

      if (process.env.NODE_ENV !== 'test' && hasS3Config) {
        logger.info({ msg: '[StorageFactory] Initializing S3/R2 Cloud Storage Provider' });
        this.instance = new S3StorageProvider();
      } else {
        logger.info({ msg: '[StorageFactory] Initializing Local Disk Storage Provider' });
        this.instance = new LocalStorageProvider();
      }
    }

    return this.instance;
  }

  public static setStorage(storage: IStorageProvider): void {
    this.instance = storage;
  }

  public static reset(): void {
    this.instance = null;
  }
}

export const defaultStorage = StorageFactory.getStorage();
