import { UserRole, Brand } from "@vishwakarma-k-c/shared";

/**
 * LLD: Branded ID Types
 */
export type UserId = Brand<"UserId", number>;
export type IdentityId = Brand<"IdentityId", number>;

/**
 * User Domain Entity
 */
export class User {
  constructor(
    public readonly id: UserId,
    public readonly publicId: string,
    public role: UserRole,
    public firstName?: string | null,
    public lastName?: string | null,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt?: Date | null
  ) {}

  public isDeleted(): boolean {
    return !!this.deletedAt;
  }

  public fullName(): string {
    return `${this.firstName ?? ""} ${this.lastName ?? ""}`.trim();
  }

  public softDelete(): void {
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }
}

/**
 * Identity Domain Entity
 */
export enum IdentityProvider {
  PHONE = "PHONE",
  EMAIL = "EMAIL",
}

export class Identity {
  constructor(
    public readonly id: IdentityId,
    public readonly userId: UserId,
    public readonly provider: IdentityProvider,
    public readonly identifier: string,
    public isVerified: boolean = false,
    public lastLoginAt?: Date | null,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public verify(): void {
    this.isVerified = true;
    this.updatedAt = new Date();
  }

  public recordLogin(): void {
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
  }
}
