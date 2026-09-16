import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { db } from '@vishwakarma-k-c/db';
import { roles, rolePermissions, permissions as permissionsTable } from '@vishwakarma-k-c/db/iam';
import { eq, and } from 'drizzle-orm';
import { 
  authenticate, 
  createPermissionGuard, 
  requireRole,
  JWTPayload,
  PermissionChecker 
} from '@vishwakarma-k-c/shared';

/**
 * Global Security Plugin for the Vishwakarma Backend
 * Decorates the fastify instance with authentication and permission logic
 */
export default fp(async (fastify: FastifyInstance) => {
  // 1. Implementation of the permission checker using the Backend's DB access
  const checkPermission: PermissionChecker = async (user, slug) => {
    const hasPermission = await db.select({ id: permissionsTable.id })
      .from(rolePermissions)
      .innerJoin(roles, eq(rolePermissions.roleId, roles.id))
      .innerJoin(permissionsTable, eq(rolePermissions.permissionId, permissionsTable.id))
      .where(and(
        eq(roles.name, user.role),
        eq(permissionsTable.slug, slug)
      ))
      .limit(1);

    return hasPermission.length > 0;
  };

  // 2. Initialize the shared guards with the backend-specific checker
  const authorize = createPermissionGuard(checkPermission);

  // 3. Decorate the fastify instance
  fastify.decorate('authenticate', authenticate);
  fastify.decorate('authorize', authorize);
  fastify.decorate('requireRole', requireRole);
});

// Type declaration for Fastify decorators
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (slug: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (...allowedRoles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user?: JWTPayload;
  }
}
