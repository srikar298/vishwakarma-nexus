import { pgEnum, integer, varchar, timestamp, jsonb, boolean, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authSchema } from "./users";
import { users } from "./users";

export const identityProviderEnum = pgEnum("identity_provider", [
  "PHONE",
  "EMAIL",
  "GOOGLE",
  "FACEBOOK",
  "APPLE",
]);

/**
 * Universal Identity Table
 * Supports multiple login methods (Phone, Email, Social) linked to a single User.
 */
export const identities = authSchema.table("identities", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  provider: identityProviderEnum("provider").notNull(),
  identifier: varchar("identifier", { length: 255 }).notNull(), // phone number, email, or social UID
  credentialHash: varchar("credentialHash", { length: 255 }), // Salted scrypt hash for MPIN/password
  isVerified: boolean("isVerified").default(false).notNull(),
  metadata: jsonb("metadata"), // For social profiles or additional provider data
  lastLoginAt: timestamp("lastLoginAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => [
  index("idx_identities_identifier_provider").on(table.identifier, table.provider),
  // Partial Index: Only indexes verified identities, making login queries extremely fast and the index lean.
  index("idx_identities_verified_search")
    .on(table.identifier, table.provider)
    .where(sql`${table.isVerified} = true`),
]);
