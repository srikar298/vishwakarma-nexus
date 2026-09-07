import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { DrizzleAuthRepository } from "./infrastructure/repositories/drizzle-iam.repository";
import { RequestOtpUseCase } from "./application/use-cases/request-otp.use-case";
import { VerifyOtpUseCase } from "./application/use-cases/verify-otp.use-case";
import { RefreshTokenUseCase } from "./application/use-cases/refresh-token.use-case";
import { RegisterUserUseCase } from "./application/use-cases/register-user.use-case";
import { GetMeUseCase } from "./application/use-cases/get-me.use-case";
import { logger } from "@vishwakarma-k-c/shared";
import { AuthController } from "./auth.controller";

/**
 * LLD: Composition Root (Auth Plugin)
 * Centralizes all Dependency Injection and wiring for the Auth module.
 */
export const bootstrapAuthModule = fp(async (fastify: FastifyInstance) => {
  logger.info("Initializing Auth Module...");

  // 1. Instantiate Infrastructure (Repositories)
  const authRepo = new DrizzleAuthRepository();

  // 2. Instantiate Use Cases
  const requestOtpUseCase = new RequestOtpUseCase(authRepo);
  const verifyOtpUseCase = new VerifyOtpUseCase(authRepo);
  const refreshTokenUseCase = new RefreshTokenUseCase(authRepo);
  const registerUserUseCase = new RegisterUserUseCase(authRepo);
  const getMeUseCase = new GetMeUseCase(authRepo);

  // 3. Register Controller / Routes
  const controller = new AuthController(
    requestOtpUseCase, 
    verifyOtpUseCase, 
    refreshTokenUseCase, 
    registerUserUseCase,
    getMeUseCase
  );

  // Note: Prefixing is handled by the parent caller (e.g. app.ts)
  await fastify.register(controller.routes.bind(controller), { prefix: "/auth" });
  
  logger.info("Auth Module initialized successfully.");
});
