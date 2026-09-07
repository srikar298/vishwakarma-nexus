import { describe, it, expect } from 'vitest';
import {
  PaginationQuerySchema,
  createPaginatedResult,
  CursorPaginationQuerySchema,
  createCursorPaginatedResult,
  successResponse,
  errorResponse,
} from './index';

describe('Component 11.2: API Contracts & Envelopes', () => {
  describe('Offset Pagination Engine', () => {
    it('should validate and parse offset pagination parameters', () => {
      const parsed = PaginationQuerySchema.parse({
        page: '2',
        limit: '25',
        sortOrder: 'asc',
      });

      expect(parsed.page).toBe(2);
      expect(parsed.limit).toBe(25);
      expect(parsed.sortOrder).toBe('asc');
    });

    it('should calculate offset pagination metadata correctly', () => {
      const items = ['a', 'b', 'c'];
      const result = createPaginatedResult(items, 50, 2, 10);

      expect(result.data).toEqual(['a', 'b', 'c']);
      expect(result.meta.page).toBe(2);
      expect(result.meta.totalPages).toBe(5);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPrevPage).toBe(true);
    });
  });

  describe('Cursor / Keyset Pagination Engine', () => {
    it('should validate cursor pagination query parameters', () => {
      const parsed = CursorPaginationQuerySchema.parse({
        cursor: 'csr_12345',
        limit: '50',
      });

      expect(parsed.cursor).toBe('csr_12345');
      expect(parsed.limit).toBe(50);
      expect(parsed.direction).toBe('forward');
    });

    it('should calculate nextCursor and hasNextPage from limit + 1 items', () => {
      const rawItems = [
        { id: 'usr_1', name: 'Alice' },
        { id: 'usr_2', name: 'Bob' },
        { id: 'usr_3', name: 'Charlie' },
        { id: 'usr_4', name: 'Dave' }, // 4th item indicates hasNextPage for limit 3
      ];

      const paginated = createCursorPaginatedResult(rawItems, 3, (item) => item.id);

      expect(paginated.data.length).toBe(3);
      expect(paginated.data[2].name).toBe('Charlie');
      expect(paginated.meta.hasNextPage).toBe(true);
      expect(paginated.meta.nextCursor).toBe('usr_3');
      expect(paginated.meta.prevCursor).toBe('usr_1');
    });

    it('should handle terminal pages where no nextCursor exists', () => {
      const rawItems = [
        { id: 'usr_1', name: 'Alice' },
        { id: 'usr_2', name: 'Bob' },
      ];

      const paginated = createCursorPaginatedResult(rawItems, 5, (item) => item.id);

      expect(paginated.data.length).toBe(2);
      expect(paginated.meta.hasNextPage).toBe(false);
      expect(paginated.meta.nextCursor).toBeUndefined();
    });
  });

  describe('ApiResponse Envelopes', () => {
    it('should format success responses with correlation tracking', () => {
      const res = successResponse({ profileId: 'prof_99' }, 'Profile loaded', {
        requestId: 'req_111',
        correlationId: 'corr_222',
      });

      expect(res.success).toBe(true);
      expect(res.data).toEqual({ profileId: 'prof_99' });
      expect(res.message).toBe('Profile loaded');
      expect(res.requestId).toBe('req_111');
      expect(res.correlationId).toBe('corr_222');
      expect(res.timestamp).toBeDefined();
    });

    it('should format error responses with errorCode and field validation errors', () => {
      const res = errorResponse('Validation failed', {
        errorCode: 'INVALID_INPUT',
        errors: {
          phone: ['Invalid phone number format'],
          password: ['Password must be at least 8 characters'],
        },
        requestId: 'req_333',
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('Validation failed');
      expect(res.errorCode).toBe('INVALID_INPUT');
      expect(res.errors?.phone).toBeDefined();
      expect(res.requestId).toBe('req_333');
    });
  });
});
