/**
 * Low-Level Design (LLD): Enterprise Media & File Storage Interfaces
 * 
 * Supports:
 * - Direct-to-Cloud client uploads via Pre-Signed S3/R2 URLs
 * - Secure pre-signed download URLs for confidential KYC & Matrimony documents
 * - Magic byte MIME inspection and file size guardrails
 * - Multi-cloud provider abstraction (AWS S3, Cloudflare R2, MinIO, Local Disk)
 */

export interface UploadOptions {
  contentType?: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
  tags?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  sizeBytes: number;
  etag?: string;
  contentType?: string;
}

export interface PresignedUploadOptions {
  contentType: string;
  maxSizeBytes?: number;
  expiresInSeconds?: number;
  isPublic?: boolean;
  metadata?: Record<string, string>;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  downloadUrl: string;
  key: string;
  expiresInSeconds: number;
  fields?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface FileMetadata {
  key: string;
  sizeBytes: number;
  contentType: string;
  lastModified: Date;
  etag?: string;
  metadata?: Record<string, string>;
}

export interface IStorageProvider {
  /**
   * Uploads binary or string data directly to storage.
   */
  upload(key: string, data: Buffer | Uint8Array | string, options?: UploadOptions): Promise<UploadResult>;

  /**
   * Downloads raw file data from storage.
   */
  download(key: string): Promise<Buffer>;

  /**
   * Generates a pre-signed URL for direct client PUT/POST uploads, bypassing backend HTTP proxying.
   */
  getPresignedUploadUrl(key: string, options: PresignedUploadOptions): Promise<PresignedUploadResult>;

  /**
   * Generates a pre-signed GET URL for secure, time-limited access to private files.
   */
  getPresignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Legacy convenience alias for getPresignedDownloadUrl.
   */
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Deletes a file from storage.
   */
  delete(key: string): Promise<boolean>;

  /**
   * Checks if a file exists in storage.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Retrieves file metadata and content attributes.
   */
  getMetadata(key: string): Promise<FileMetadata | null>;
}
