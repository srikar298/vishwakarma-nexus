import "fastify";

declare module "fastify" {
  interface FastifyContextConfig {
    idempotency?: boolean;
  }
}

// 1. Core Observability & Config
export * from './logger';
export * from './config';
export * from './constants';

// 2. Security & Identity
export * from './auth/jwt.service';
export * from './auth/fastify-guards';
export * from './crypto';

// 3. Resilience & Fault Tolerance
export * from './resilience';

// 4. Concurrency & Locking
export * from './concurrency';

// 5. Caching & Performance
export * from './cache';
export * from './rate-limit';
export * from './rate-limit/profiles';
export { default as idempotencyPlugin } from './infrastructure/plugins/idempotency.plugin';

// 6. Deep Health & Readiness
export * from './health';

// 7. Security & Compliance Audit
export * from './audit';

// 8. Multi-Channel Notifications
export * from './notifications';
export * from './messaging/firebase.service';

// 9. Storage Strategy
export * from './storage';

// 10. Event-Driven Architecture & Worker Queues
export * from './events';
export * from './queue';

// 11. Contracts, Response Envelopes & Lifecycle
export * from './contracts';
export * from './lifecycle';

// 11. Domain Shared
export * from './domain-shared/result';
export * from './domain-shared/errors';
export * from './domain-shared/branding';
export * from './domain-shared/enums';
export * from './validation/auth.schema';
