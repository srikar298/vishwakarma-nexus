/**
 * VKC Backend API Client
 * A typed fetch wrapper that calls the Fastify backend at /api/v1.
 * Returns { data, error } tuples so call-sites look identical to the
 * old Supabase SDK — making migration diffs minimal.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

const API_BASE = `${BASE_URL}/api/v1`;

/** Auth token key used by the Admin panel */
const TOKEN_KEY = 'vkc_admin_token';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = window.localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}/${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ message: res.statusText }));
      return { data: null, error: { message: errBody?.message ?? res.statusText } };
    }

    const data: T = await res.json();
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { data: null, error: { message } };
  }
}

// ---------------------------------------------------------------------------
// Public API Client
// ---------------------------------------------------------------------------

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

// ---------------------------------------------------------------------------
// Auth helpers (used by Admin panel)
// ---------------------------------------------------------------------------

export const authToken = {
  set: (token: string) => window.localStorage.setItem(TOKEN_KEY, token),
  get: () =>
    typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null,
  clear: () => window.localStorage.removeItem(TOKEN_KEY),
};
