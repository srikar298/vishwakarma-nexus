import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";
import { User } from "../../domain/entities/user-identity.entity";
import { Result, DynamicDomainError } from "@vishwakarma-k-c/shared";
import { PermissionProvider } from "../services/permission-provider";

export interface GetMeCommand {
  userId: string;
}

export interface MeResponse {
  user: User;
  permissions: string[];
}

export class GetMeUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  public async execute(command: GetMeCommand): Promise<Result<MeResponse, Error>> {
    const { userId } = command;

    // 1. Resolve User
    const user = await (this.authRepository as any).findByPublicId(userId);
    if (!user) {
      return Result.fail(new DynamicDomainError("NOT_FOUND", "User profile no longer exists."));
    }

    // 2. Resolve Permissions (High Performance via Redis)
    // PermissionProvider.repository is already static and initialized to DrizzleAuthRepository
    const permissions = await (PermissionProvider as any).repository.getUserPermissions(Number(user.id));

    return Result.ok({
      user,
      permissions
    });
  }
}
