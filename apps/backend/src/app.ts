import Fastify, { FastifyInstance } from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import compress from "@fastify/compress";
import rateLimit from "@fastify/rate-limit";
import { 
  config, 
  logger, 
  StandardRateLimit, 
  idempotencyPlugin, 
  defaultHealthAggregator,
  DatabaseHealthIndicator,
  RedisHealthIndicator,
  cacheProvider,
  defaultMetricsRegistry,
} from "@vishwakarma-k-c/shared";
import { db } from "@vishwakarma-k-c/db";
import { sql } from "drizzle-orm";
import securityPlugin from "./guards/permission.guard";
import errorHandlerPlugin from "./plugins/error-handler.plugin";
import {
  bootstrapAuthModule,
  bootstrapMembersModule,
  bootstrapFinanceModule,
  bootstrapMatrimonyModule,
  bootstrapProfessionalsModule,
  bootstrapCommunityModule,
  bootstrapHeritageModule,
  bootstrapEducationModule,
  bootstrapGovernanceModule,
  bootstrapEmpowermentModule,
  bootstrapMessagingModule,
  bootstrapSupportModule,
} from "@vishwakarma-k-c/modules";

/**
 * Modular App Composition Root
 * Encapsulates all Fastify configurations, plugins, and global hooks.
 */
export async function bootstrapApp() {
  const app = Fastify({
    logger: true,
    disableRequestLogging: true, // Using custom observability hooks
  }).withTypeProvider<ZodTypeProvider>();

  // 0. Register Health Diagnostics Indicators
  const dbHealthIndicator = new DatabaseHealthIndicator(async () => {
    await db.execute(sql`SELECT 1`);
  });
  const redisHealthIndicator = new RedisHealthIndicator(cacheProvider);
  defaultHealthAggregator.registerIndicator(dbHealthIndicator);
  defaultHealthAggregator.registerIndicator(redisHealthIndicator);

  // 1. Set Zod Compiler for Type-Safe Routes
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // 2. Global Exception & Contract Envelope Normalizer
  await app.register(errorHandlerPlugin);

  // 3. Global Traffic Control (DDoS Protection)
  // Higher threshold to prevent massive botnets while allowing normal flow
  await app.register(rateLimit, {
    ...StandardRateLimit,
    global: true,
  });

  // 4. Security Foundations
  await app.register(helmet, { global: true });
  await app.register(cors, {
    origin: config.app.allowedOrigins,
    credentials: true,
  });

  // 5. Performance Optimization
  await app.register(compress);

  // 6. Enterprise Reliability: Idempotency
  await app.register(idempotencyPlugin);

  // 7. Security Layer: Authentication & Authorization Guards
  await app.register(securityPlugin);

  // 6. Observability Hooks (Tracing & Auditing)
  app.addHook("onRequest", async (request) => {
    (request as any).startTime = process.hrtime();
    
    logger.info({ 
      msg: "Incoming Request", 
      method: request.method, 
      url: request.url, 
      requestId: request.id 
    });
  });

  app.addHook("onResponse", async (request, reply) => {
    const startTime = (request as any).startTime;
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    
    logger.info({
      msg: "Request Completed",
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration: `${durationMs}ms`,
      requestId: request.id,
      idempCache: reply.getHeader("X-Idempotency-Cache") || "MISS",
    });
    
    reply.header("X-Response-Time", `${durationMs}ms`);
  });

  // 7. Versioned API Modules
  await app.register(async (v1) => {
    // Deep Subsystem Health Check inside V1
    v1.get("/health", async (request, reply) => {
      const report = await defaultHealthAggregator.checkHealth();
      const statusCode = report.status === 'unhealthy' ? 503 : 200;
      return reply.code(statusCode).send(report);
    });

    // Modules
    await bootstrapAuthModule(v1);
    await bootstrapMembersModule(v1);
    await bootstrapFinanceModule(v1);
    await bootstrapMatrimonyModule(v1);
    await bootstrapProfessionalsModule(v1);
    await bootstrapCommunityModule(v1);
    await bootstrapHeritageModule(v1);
    await bootstrapEducationModule(v1);
    await bootstrapGovernanceModule(v1);
    await bootstrapEmpowermentModule(v1);
    await bootstrapMessagingModule(v1);
    await bootstrapSupportModule(v1);
    
  }, { prefix: "/api/v1" });

  // Root-level Fast Liveness Probe
  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Root-level Prometheus Metrics Scraping Endpoint
  app.get("/metrics", async (request, reply) => {
    reply.header("Content-Type", "text/plain; version=0.0.4");
    return reply.send(defaultMetricsRegistry.exportPrometheus());
  });

  return app;
}
