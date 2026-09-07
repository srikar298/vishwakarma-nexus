import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";
import { User } from "../../domain/entities/user-identity.entity";
import { Result, DynamicDomainError, logger } from "@vishwakarma-k-c/shared";

export interface RegisterUserCommand {
  userId: string; // The publicId
  firstName: string;
  lastName: string;
}

export class RegisterUserUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  public async execute(command: RegisterUserCommand): Promise<Result<User, Error>> {
    const { userId, firstName, lastName } = command;

    // 1. Resolve User by PublicId
    const user = await (this.authRepository as any).findByPublicId(userId);
    if (!user) {
      return Result.fail(new DynamicDomainError("NOT_FOUND", `User with ID ${userId} not found.`));
    }

    // 2. Update profile
    user.firstName = firstName;
    user.lastName = lastName;
    user.updatedAt = new Date();

    await this.authRepository.updateUser(user);
    
    logger.info({ userId }, "User profile completed successfully.");

    return Result.ok(user);
  }
}
