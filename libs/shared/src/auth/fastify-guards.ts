import type { FastifyRequest, FastifyReply } from 'fastify';
import { JWTService, JWTPayload } from './jwt.service';

/**
 * Fastify Hook: Authenticates a request via JWT from the Authorization header
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
