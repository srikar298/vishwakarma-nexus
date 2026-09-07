import { z } from 'zod';

// --- 1. Offset Pagination ---

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function createPaginatedResult<T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  return {
    data,
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

// --- 2. Keyset / Cursor Pagination (High-Performance Feeds) ---

export const CursorPaginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  direction: z.enum(['forward', 'backward']).default('forward'),
});

export type CursorPaginationQuery = z.infer<typeof CursorPaginationQuerySchema>;

export interface CursorPaginationMeta {
  limit: number;
  count: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

export interface CursorPaginatedResult<T> {
  data: T[];
  meta: CursorPaginationMeta;
}

/**
 * Creates a cursor-paginated result for high-throughput infinite feeds (Matrimony, Community).
 * Fetches limit + 1 items from database to compute hasNextPage with 0 extra count queries.
 */
export function createCursorPaginatedResult<T>(
  items: T[],
  limit: number,
  getCursor: (item: T) => string
): CursorPaginatedResult<T> {
  const hasNextPage = items.length > limit;
  const data = hasNextPage ? items.slice(0, limit) : items;

  const nextCursor = data.length > 0 && hasNextPage
    ? getCursor(data[data.length - 1])
    : undefined;

  const prevCursor = data.length > 0
    ? getCursor(data[0])
    : undefined;

  return {
    data,
    meta: {
      limit,
      count: data.length,
      hasNextPage,
      hasPrevPage: false,
      nextCursor,
      prevCursor,
    },
  };
}
