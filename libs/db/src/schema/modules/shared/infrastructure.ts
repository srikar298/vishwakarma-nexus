import { pgSchema, integer, varchar, timestamp, jsonb, text, index } from "drizzle-orm/pg-core";

export const sharedSchema = pgSchema("shared_mod");

/**
 * Transactional Outbox for Cross-Module Events
 */
export const outboxEvents = sharedSchema.table("outboxEvents", {
  id: varchar("id", { length: 36 }).primaryKey(),
  eventName: varchar("eventName", { length: 100 }).notNull(),
  aggregateId: varchar("aggregateId", { length: 100 }).notNull(),
  payload: jsonb("payload").notNull(),
  version: integer("version").default(1).notNull(),
  metadata: jsonb("metadata"),
  status: varchar("status", { length: 20 }).default("PENDING").notNull(),
  attemptsMade: integer("attemptsMade").default(0).notNull(),
  lastError: text("lastError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  publishedAt: timestamp("publishedAt"),
}, (table) => [
  index("idx_outbox_status_created").on(table.status, table.createdAt),
]);

/**
 * Centralized Audit Logging for Mutations
 */
export const auditLogs = sharedSchema.table("auditLogs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  actorId: integer("actorId"), // Loose FK to users.id to avoid circularity
  action: varchar("action", { length: 50 }).notNull(), // e.g. 'CREATE', 'UPDATE', 'DELETE'
  entityType: varchar("entityType", { length: 50 }).notNull(), // e.g. 'USER', 'PROFILE'
  entityId: varchar("entityId", { length: 100 }).notNull(),
  oldData: jsonb("oldData"),
  newData: jsonb("newData"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

/**
 * Universal Verification Registry
 * Manages TTL and state for OTPs and verification codes.
 */
export const otpVerifications = sharedSchema.table("otpVerifications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  identityId: integer("identityId").notNull(), // Loose FK to identities.id
  purpose: varchar("purpose", { length: 50 }).notNull(), // e.g. 'LOGIN', 'EMAIL_VERIFY'
  codeHash: text("codeHash").notNull(), 
  attempts: integer("attempts").default(0).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Centralized Media Asset Registry
 */
export const mediaAssets = sharedSchema.table("mediaAssets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  publicId: varchar("publicId", { length: 21 }).notNull().unique(),
  ownerId: integer("ownerId"), // User who uploaded it
  bucket: varchar("bucket", { length: 50 }).notNull(), // e.g. 'profiles', 'heritage'
  key: text("key").notNull(), // S3/R2 object key
  mimeType: varchar("mimeType", { length: 100 }),
  size: integer("size"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
