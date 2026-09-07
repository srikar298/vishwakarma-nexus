import { db } from "@vishwakarma-k-c/db";
import { users, identities, roles, rolePermissions, permissions, userRoles } from "@vishwakarma-k-c/db/iam";
import { eq, and } from "drizzle-orm";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";
import { User, Identity, UserId, IdentityProvider } from "../../domain/entities/user-identity.entity";
import { UserRole } from "@vishwakarma-k-c/shared";
import { nanoid } from "nanoid";

export class DrizzleAuthRepository implements IAuthRepository {
  /**
   * Domain Mapper: Database Row to User Entity
   */
  private mapToUser(row: any): User {
    return new User(
      row.id as UserId,
      row.publicId,
      row.role as UserRole,
      row.firstName,
      row.lastName,
      row.createdAt,
      row.updatedAt,
      row.deletedAt
    );
  }

  /**
   * Domain Mapper: Database Row to Identity Entity
   */
  private mapToIdentity(row: any): Identity {
    return new Identity(
      row.id as any,
      row.userId as UserId,
      row.provider as IdentityProvider,
      row.identifier,
      row.isVerified,
      row.lastLoginAt,
      row.createdAt,
      row.updatedAt
    );
  }

  async findByIdentifier(provider: string, identifier: string): Promise<Identity | null> {
    const results = await db
      .select()
      .from(identities)
      .where(
        and(
          eq(identities.identifier, identifier),
          eq(identities.provider, provider as any)
        )
      )
      .limit(1);

    return results[0] ? this.mapToIdentity(results[0]) : null;
  }

  async findUserById(userId: UserId): Promise<User | null> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return results[0] ? this.mapToUser(results[0]) : null;
  }

  async findByPublicId(publicId: string): Promise<User | null> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.publicId, publicId))
      .limit(1);

    return results[0] ? this.mapToUser(results[0]) : null;
  }

  async createUser(role: UserRole): Promise<User> {
    const [row] = await db
      .insert(users)
      .values({
        publicId: nanoid(),
        role: role,
      })
      .returning();

    return this.mapToUser(row);
  }

  async createIdentity(userId: UserId, provider: string, identifier: string): Promise<Identity> {
    const [row] = await db
      .insert(identities)
      .values({
        userId,
        provider: provider as any,
        identifier,
        isVerified: true, // For OTP signups, we assume verified once created through that flow
      })
      .returning();

    return this.mapToIdentity(row);
  }

  async updateIdentity(identity: Identity): Promise<void> {
    await db
      .update(identities)
      .set({
        isVerified: identity.isVerified,
        lastLoginAt: identity.lastLoginAt,
        updatedAt: new Date(),
      })
      .where(eq(identities.id, identity.id as any));
  }

  async updateUser(user: User): Promise<void> {
    await db
      .update(users)
      .set({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        updatedAt: new Date(),
        deletedAt: user.deletedAt,
      })
      .where(eq(users.id, user.id));
  }

  async mergeAccounts(sourceUserId: UserId, targetUserId: UserId): Promise<void> {
    // Logic to move identities from source to target and delete source user
    await db.transaction(async (tx: any) => {
      await tx
        .update(identities)
        .set({ userId: targetUserId })
        .where(eq(identities.userId, sourceUserId));
      
      await tx
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.id, sourceUserId));
    });
  }

  /**
   * Optimized Join for Permissions (As per SDE-3 guidelines)
   */
  async getUserPermissions(userId: number): Promise<string[]> {
    const results = await db
      .select({ slug: permissions.slug })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(userRoles.userId, userId));

    return results.map((r: any) => r.slug);
  }
}
