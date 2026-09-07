import { cacheProvider, logger } from "@vishwakarma-k-c/shared";
import { DrizzleAuthRepository } from "../../infrastructure/repositories/drizzle-iam.repository";

export class PermissionProvider {
  private static readonly repository = new DrizzleAuthRepository();
  private static readonly CACHE_TTL = 3600; // 1 Hour

  /**
   * Resolves whether a user has a specific permission
   * Implements Redis Caching for SDE-3 performance
   */
  static async hasPermission(userId: string, permissionSlug: string): Promise<boolean> {
    const cacheKey = `user_perms:${userId}`;
    
    // 1. Try Cache
    let permissions = await cacheProvider.get<string[]>(cacheKey);

    if (!permissions) {
      // 2. Try DB (Cache Miss)
      try {
        logger.debug({ userId }, "Permission Cache MISS. Fetching from DB.");
        permissions = await this.repository.getUserPermissions(Number(userId));
        
        // 3. Populate Cache
        await cacheProvider.set(cacheKey, permissions, this.CACHE_TTL);
      } catch (err) {
        logger.error({ err, userId }, "Failed to fetch permissions from DB.");
        return false;
      }
    } else {
      logger.trace({ userId }, "Permission Cache HIT.");
    }

    return permissions.includes(permissionSlug);
  }

  /**
   * Invalidates the permission cache for a user
   * Call this when a user's role/permissions are updated
   */
  static async invalidateCache(userId: string): Promise<void> {
    await cacheProvider.delete(`user_perms:${userId}`);
    logger.info({ userId }, "User permission cache invalidated.");
  }
}
