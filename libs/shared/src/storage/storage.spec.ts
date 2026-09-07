import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  LocalStorageProvider,
  S3StorageProvider,
  MimeValidator,
  StorageFactory,
} from './index';
import { promises as fs } from 'fs';
import * as path from 'path';

describe('Component 9: Media & File Storage Strategy', () => {
  const testUploadDir = './tmp_test_uploads';

  beforeEach(async () => {
    await fs.mkdir(testUploadDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(testUploadDir, { recursive: true, force: true });
    } catch {}
  });

  describe('MimeValidator (Magic Byte Sniffer & Anti-Spoofing)', () => {
    it('should accurately detect JPEG files by magic bytes', () => {
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
      const mime = MimeValidator.detectMimeType(jpegBuffer);
      expect(mime).toBe('image/jpeg');
      expect(MimeValidator.isAllowedImage(jpegBuffer)).toBe(true);
    });

    it('should accurately detect PNG files by magic bytes', () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
      const mime = MimeValidator.detectMimeType(pngBuffer);
      expect(mime).toBe('image/png');
      expect(MimeValidator.isAllowedImage(pngBuffer)).toBe(true);
    });

    it('should accurately detect PDF documents by magic bytes', () => {
      const pdfBuffer = Buffer.from('%PDF-1.4 sample content', 'utf8');
      const mime = MimeValidator.detectMimeType(pdfBuffer);
      expect(mime).toBe('application/pdf');
      expect(MimeValidator.isAllowedDocument(pdfBuffer)).toBe(true);
    });

    it('should accurately detect WebP images by magic bytes', () => {
      const webpHeader = Buffer.concat([
        Buffer.from('RIFF', 'ascii'),
        Buffer.from([0x00, 0x00, 0x00, 0x00]),
        Buffer.from('WEBP', 'ascii'),
      ]);
      const mime = MimeValidator.detectMimeType(webpHeader);
      expect(mime).toBe('image/webp');
      expect(MimeValidator.isAllowedImage(webpHeader)).toBe(true);
    });

    it('should reject spoofed script files pretending to be images', () => {
      const spoofedPhp = Buffer.from('<?php echo "malicious code"; ?>', 'utf8');
      const res = MimeValidator.validateFile(spoofedPhp, ['image/jpeg', 'image/png']);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('Unsupported or unidentifiable file format');
    });

    it('should reject files exceeding the maximum allowed size limit', () => {
      const largeBuffer = Buffer.alloc(2 * 1024 * 1024); // 2 MB
      const res = MimeValidator.validateFile(largeBuffer, ['image/png'], 1 * 1024 * 1024); // 1 MB limit
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('exceeds maximum allowed size');
    });
  });

  describe('LocalStorageProvider', () => {
    let storage: LocalStorageProvider;

    beforeEach(() => {
      storage = new LocalStorageProvider(testUploadDir, '/test-media');
    });

    it('should upload, check existence, download, and delete local files', async () => {
      const key = 'members/avatars/user_101.png';
      const fileData = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

      // 1. Upload
      const uploadRes = await storage.upload(key, fileData);
      expect(uploadRes.key).toBe(key);
      expect(uploadRes.url).toBe('/test-media/members/avatars/user_101.png');
      expect(uploadRes.contentType).toBe('image/png');

      // 2. Exists
      const exists = await storage.exists(key);
      expect(exists).toBe(true);

      // 3. Download
      const downloaded = await storage.download(key);
      expect(Buffer.compare(downloaded, fileData)).toBe(0);

      // 4. Metadata
      const meta = await storage.getMetadata(key);
      expect(meta).toBeDefined();
      expect(meta?.sizeBytes).toBe(fileData.length);

      // 5. Delete
      const deleted = await storage.delete(key);
      expect(deleted).toBe(true);

      const existsAfter = await storage.exists(key);
      expect(existsAfter).toBe(false);
    });

    it('should generate pre-signed upload and download URLs', async () => {
      const presignedUpload = await storage.getPresignedUploadUrl('kyc/doc_1.pdf', {
        contentType: 'application/pdf',
        expiresInSeconds: 600,
      });

      expect(presignedUpload.uploadUrl).toContain('/direct-upload/kyc/doc_1.pdf');
      expect(presignedUpload.downloadUrl).toBe('/test-media/kyc/doc_1.pdf');
      expect(presignedUpload.headers?.['Content-Type']).toBe('application/pdf');

      const presignedDownload = await storage.getPresignedDownloadUrl('kyc/doc_1.pdf', 300);
      expect(presignedDownload).toContain('/test-media/kyc/doc_1.pdf?expires=');
    });
  });

  describe('S3StorageProvider', () => {
    let s3Storage: S3StorageProvider;

    beforeEach(() => {
      s3Storage = new S3StorageProvider({
        bucket: 'vkc-cloud-storage',
        region: 'ap-south-1',
        accessKeyId: 'AKIA_TEST_ACCESS_KEY',
        secretAccessKey: 'test_secret_access_key',
        publicCdnUrl: 'https://cdn.vishwakarma.org',
      });
    });

    it('should generate AWS SigV4 pre-signed upload URLs for direct client uploads', async () => {
      const presigned = await s3Storage.getPresignedUploadUrl('matrimony/photos/bride_01.jpg', {
        contentType: 'image/jpeg',
        expiresInSeconds: 900,
      });

      expect(presigned.uploadUrl).toContain('https://cdn.vishwakarma.org/matrimony/photos/bride_01.jpg');
      expect(presigned.uploadUrl).toContain('X-Amz-Algorithm=AWS4-HMAC-SHA256');
      expect(presigned.uploadUrl).toContain('X-Amz-Credential=AKIA_TEST_ACCESS_KEY');
      expect(presigned.uploadUrl).toContain('X-Amz-Expires=900');
      expect(presigned.downloadUrl).toBe('https://cdn.vishwakarma.org/matrimony/photos/bride_01.jpg');
    });

    it('should generate pre-signed download URLs for confidential documents', async () => {
      const downloadUrl = await s3Storage.getPresignedDownloadUrl('kyc/confidential_aadhaar.pdf', 1800);
      expect(downloadUrl).toContain('https://cdn.vishwakarma.org/kyc/confidential_aadhaar.pdf');
      expect(downloadUrl).toContain('expires=');
      expect(downloadUrl).toContain('sig=');
    });

    it('should upload file and return CDN accelerated URL', async () => {
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      const res = await s3Storage.upload('public/banners/diwali.jpg', jpegBuffer);

      expect(res.url).toBe('https://cdn.vishwakarma.org/public/banners/diwali.jpg');
      expect(res.contentType).toBe('image/jpeg');
      expect(res.etag).toBeDefined();
    });
  });

  describe('StorageFactory', () => {
    it('should provide a valid default storage instance', () => {
      const storage = StorageFactory.getStorage();
      expect(storage).toBeDefined();
      expect(typeof storage.upload).toBe('function');
      expect(typeof storage.getPresignedUploadUrl).toBe('function');
    });
  });
});
