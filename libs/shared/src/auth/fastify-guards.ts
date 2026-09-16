import type { FastifyRequest, FastifyReply } from 'fastify';
import { JWTService, JWTPayload } from './jwt.service';
import { cacheProvider } from '../cache';

/**
 * Fastify Hook: Authenticates a request via JWT from the Authorization header
 * Enforces Distributed Instant Revocation via cluster-wide min_valid_iat checks.
 */
export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Unauthorized: Missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    const payload = await JWTService.verifyToken(token);

    if (!payload) {
      return reply.code(401).send({ error: 'Unauthorized: Token expired or invalid' });
    }

    // Distributed Instant Revocation Check: min_valid_iat epoch guard
    if (payload.id) {
      const minValidIat = await cacheProvider.get<number>(`auth:min_valid_iat:${payload.id}`);
      if (minValidIat && payload.iat && payload.iat < minValidIat) {
        return reply.code(401).send({ error: 'Unauthorized: Session has been revoked' });
      }
    }

    // Attach user payload to the request for downstream guards
    (request as any).user = payload;
  } catch (error) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
};

/**
 * Interface for the authorization engine to decouple from the database
 */
export type PermissionChecker = (user: JWTPayload, slug: string) => Promise<boolean>;

/**
 * Fastify Hook Factory: Checks if the authenticated user has a specific permission
 * Uses a provider function to perform the actual check, decoupling Shared from DB.
 */
export const createPermissionGuard = (checkPermission: PermissionChecker) => {
  return (slug: string) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user as JWTPayload;
      if (!user) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const hasPermission = await checkPermission(user, slug);

      if (!hasPermission) {
        return reply.code(403).send({ 
          error: 'Forbidden', 
          message: `Insufficient permissions: Required '${slug}'` 
        });
      }
    };
  };
};

/**
 * Fastify Hook Factory: Checks if the authenticated user has one of the allowed roles.
 * High-performance O(1) in-memory check without database overhead.
 */
export const requireRole = (...allowedRoles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user as JWTPayload;
    if (!user) {
      return reply.code(401).send({ error: 'Unauthorized', message: 'Authentication required' });
    }

    if (!allowedRoles.includes(user.role)) {
      return reply.code(403).send({
        error: 'Forbidden',
        message: `Insufficient permissions. Requires one of: ${allowedRoles.join(', ')}`,
      });
    }
  };
};
