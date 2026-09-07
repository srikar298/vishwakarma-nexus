import { User, Identity } from "../../domain/entities/user-identity.entity";

/**
 * LLD: Presentation Mapper
 * Ensures secure DTO generation for the API layer.
 */
export class AuthPresentationMapper {
  /**
   * Domain User -> Safe API DTO
   */
  public static toUserResponse(user: User) {
    return {
      userId: user.publicId, // Using publicId for API
      role: user.role,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName(),
      },
      createdAt: user.createdAt.toISOString(),
    };
  }

  /**
   * Domain Identity -> Safe API DTO
   */
  public static toIdentityResponse(identity: Identity) {
    return {
      provider: identity.provider,
      identifier: identity.identifier,
      isVerified: identity.isVerified,
      lastLoginAt: identity.lastLoginAt?.toISOString(),
    };
  }
}
