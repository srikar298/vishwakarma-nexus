import { TokenService, AuthTokens } from "../services/token.service";
import { Result, DynamicDomainError } from "@vishwakarma-k-c/shared";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export interface RefreshTokenCommand {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  private readonly tokenService: TokenService;

  constructor(
    private readonly authRepository: IAuthRepository
  ) {
    this.tokenService = new TokenService(this.authRepository);
  }

  public async execute(command: RefreshTokenCommand): Promise<Result<AuthTokens, Error>> {
    const { refreshToken } = command;

    // 1. Attempt rotation via TokenService (handles security checks and Redis rotation)
    const tokens = await this.tokenService.rotateRefreshToken(refreshToken);

    if (!tokens) {
      return Result.fail(new DynamicDomainError("UNAUTHORIZED", "Invalid or expired refresh token. Please login again."));
    }

    return Result.ok(tokens);
  }
}
