import { FastifyInstance, FastifyPluginAsync, FastifyError } from 'fastify';
import fp from 'fastify-plugin';
import { 
  BaseDomainError, 
  NotFoundError, 
  ConflictError, 
  UnauthorizedError, 
  ValidationError, 
  errorResponse, 
  logger 
} from '@vishwakarma-k-c/shared';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

/**
 * Global Fastify Error Handler Plugin.
 * Normalizes all thrown domain errors, Zod validation issues, and unexpected exceptions
 * into the standardized ApiResponse contract envelope.
 */
const errorHandlerPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.setErrorHandler((error: FastifyError | Error | any, request, reply) => {
    // 1. Zod Request Schema Validation Errors
    if (hasZodFastifySchemaValidationErrors(error)) {
      const fieldErrors: Record<string, string[]> = {};
      const validationList = Array.isArray(error.validation) ? error.validation : [];

      for (const issue of validationList) {
        const anyIssue = issue as any;
        const path = anyIssue?.params?.issue?.path?.join('.') || anyIssue?.instancePath || 'body';
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(issue.message || 'Invalid value');
      }

      return reply.status(400).send(
        errorResponse('Validation failed', fieldErrors)
      );
    }

    // 2. Domain-Driven Design Domain Errors
    if (error instanceof BaseDomainError) {
      let statusCode = 400;
      if (error instanceof NotFoundError) {
        statusCode = 404;
      } else if (error instanceof UnauthorizedError) {
        statusCode = 401;
      } else if (error instanceof ConflictError) {
        statusCode = 409;
      } else if (error instanceof ValidationError) {
        statusCode = 422;
      }

      return reply.status(statusCode).send(
        errorResponse(error.message || 'Domain error')
      );
    }

    // 3. Fastify Standard HTTP Status Errors (e.g. 404, 429 Rate Limit)
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      const statusCode = Number(error.statusCode);
      if (statusCode >= 400 && statusCode < 500) {
        return reply.status(statusCode).send(
          errorResponse(error.message || 'Request failed')
        );
      }
    }

    // 4. Unhandled 500 Internal Server Errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error({
      msg: 'Unhandled Exception',
      requestId: request.id,
      url: request.url,
      method: request.method,
      error: errorMessage,
      stack: errorStack,
    });

    return reply.status(500).send(
      errorResponse('An internal server error occurred. Please try again later.')
    );
  });
};

export default fp(errorHandlerPlugin, {
  name: 'errorHandlerPlugin',
});
