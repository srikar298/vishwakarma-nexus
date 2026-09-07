export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errorCode?: string;
  errors?: Record<string, string[]>;
  timestamp: string;
  requestId?: string;
  correlationId?: string;
}

export interface ResponseMetaOptions {
  requestId?: string;
  correlationId?: string;
  errorCode?: string;
  errors?: Record<string, string[]>;
}

// TASK: [Observability Integration] Bind requestId & correlationId from Fastify request headers (x-request-id / x-correlation-id) and ContextualLogger child context
export function successResponse<T>(
  data: T,
  message?: string,
  meta?: { requestId?: string; correlationId?: string }
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    requestId: meta?.requestId,
    correlationId: meta?.correlationId,
  };
}

export function errorResponse(
  error: string,
  options?: ResponseMetaOptions | Record<string, string[]>
): ApiResponse<never> {
  const isOptionsObject = options && ('errorCode' in options || 'errors' in options || 'requestId' in options);
  const meta = isOptionsObject ? (options as ResponseMetaOptions) : undefined;
  const legacyErrors = !isOptionsObject && options ? (options as Record<string, string[]>) : undefined;

  return {
    success: false,
    error,
    errorCode: meta?.errorCode,
    errors: meta?.errors || legacyErrors,
    timestamp: new Date().toISOString(),
    requestId: meta?.requestId,
    correlationId: meta?.correlationId,
  };
}
