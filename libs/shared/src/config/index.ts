import { z } from 'zod';

/**
 * Raw Environment Schema
 * Used for initial parsing and validation of process.env.
 */
const rawSchema = z.object({
  // App Config
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(['info', 'debug', 'warn', 'error']).default('info'),
  ALLOWED_ORIGINS: z.preprocess(
    (v) => (typeof v === 'string' ? v.split(',') : v),
    z.array(z.string()).min(1)
  ).default(['http://localhost:3000', 'http://localhost:5173']),

  // Database
  DATABASE_URL: z.string().url(),
  AUDIT_RETENTION_DAYS: z.coerce.number().min(1).max(3650).default(90),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  INITIAL_ADMIN_IDENTIFIER: z.string().optional().describe("ID of the first super-admin (phone/email)"),

  // Firebase (Optional in Dev, Mandatory in Prod)
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().min(0).max(15).default(0),
  REDIS_PREFIX: z.string().default('vkc:'),
});

/**
 * Structured & Transformed Config Schema
 * Groups flat environment variables into logical sub-objects.
 */
const configSchema = rawSchema.transform((values) => ({
  app: {
    env: values.NODE_ENV,
    port: values.PORT,
    logLevel: values.LOG_LEVEL,
    allowedOrigins: values.ALLOWED_ORIGINS,
    isProduction: values.NODE_ENV === 'production',
    isDevelopment: values.NODE_ENV === 'development',
    isTest: values.NODE_ENV === 'test',
  },
  db: {
    url: values.DATABASE_URL,
    auditRetentionDays: values.AUDIT_RETENTION_DAYS,
  },
  auth: {
    jwtSecret: values.JWT_SECRET,
    jwtExpiresIn: values.JWT_EXPIRES_IN,
    initialAdminIdentifier: values.INITIAL_ADMIN_IDENTIFIER,
    firebase: {
      projectId: values.FIREBASE_PROJECT_ID,
      clientEmail: values.FIREBASE_CLIENT_EMAIL,
      privateKey: values.FIREBASE_PRIVATE_KEY,
    },
  },
  redis: {
    url: values.REDIS_URL,
    password: values.REDIS_PASSWORD,
    db: values.REDIS_DB,
    prefix: values.REDIS_PREFIX,
  },
}));

/**
 * Deep Freeze Utility
 * Ensures the configuration is immutable throughout the application lifecycle.
 */
function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });
  return obj;
}

// 1. Initial Parsing
const result = configSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Configuration validation failed:', JSON.stringify(result.error.format(), null, 2));
  process.exit(1);
}

// 2. Export Immutable "Golden Config"
export const config = deepFreeze(result.data);

/**
 * Log Masking Helper
 * Returns a copy of the config with sensitive fields masked for safe logging.
 */
export function getMaskedConfig() {
  const masked = JSON.parse(JSON.stringify(config));
  masked.auth.jwtSecret = "********";
  if (masked.auth.firebase.privateKey) masked.auth.firebase.privateKey = "********";
  if (masked.redis.password) masked.redis.password = "********";
  return masked;
}
