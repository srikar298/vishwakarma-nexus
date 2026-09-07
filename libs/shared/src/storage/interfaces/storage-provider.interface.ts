export interface UploadOptions {
  contentType?: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  sizeBytes: number;
}

export interface IStorageProvider {
  upload(key: string, data: Buffer | Uint8Array | string, options?: UploadOptions): Promise<UploadResult>;
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
  delete(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
}
