import { User, Identity } from "../../domain/entities/user-identity.entity";

/**
 * Auth Infrastructure Mapper
 * Translates between Domain Entities and Persistence Models (Database Rows).
 */
export class AuthInfrastructureMapper {
  /**
   * User Domain Entitiy -> Database Row
   */
  public static toUserPersistence(user: User) {
    return {
      id: user.id,
      publicId: user.publicId,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  /**
   * Database Row -> User Domain Entity
   */
  public static toUserDomain(row: any): User {
    return new User(
      row.id,
      row.publicId,
      row.role,
      row.firstName,
      row.lastName,
      row.createdAt,
      row.updatedAt,
      row.deletedAt
    );
  }

  /**
   * Identity Domain Entity -> Database Row
   */
  public static toIdentityPersistence(identity: Identity) {
    return {
      id: identity.id,
      userId: identity.userId,
      provider: identity.provider,
      identifier: identity.identifier,
      isVerified: identity.isVerified,
      lastLoginAt: identity.lastLoginAt,
      createdAt: identity.createdAt,
      updatedAt: identity.updatedAt,
    };
  }

  /**
   * Database Row -> Identity Domain Entity
   */
  public static toIdentityDomain(row: any): Identity {
    return new Identity(
      row.id,
      row.userId,
      row.provider as any,
      row.identifier,
      row.isVerified,
      row.lastLoginAt,
      row.createdAt,
      row.updatedAt
    );
  }
}
