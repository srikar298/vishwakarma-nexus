import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "@vishwakarma-k-c/shared";

// Unified schema object for Drizzle initialization (Internal & Migrations)
import * as iamEnums from "./schema/enums/iam";
import * as expertEnums from "./schema/enums/experts";
import * as commonEnums from "./schema/enums/common";
import * as financeEnums from "./schema/enums/finance";
import * as iam from "./schema/modules/iam";
import * as members from "./schema/modules/members";
import * as finance from "./schema/modules/finance";
import * as matrimony from "./schema/modules/matrimony";
import * as professionals from "./schema/modules/professionals";
import * as shared from "./schema/modules/shared";

export const schema = {
  ...iamEnums,
  ...expertEnums,
  ...commonEnums,
  ...financeEnums,
  ...iam,
  ...members,
  ...finance,
  ...matrimony,
  ...professionals,
  ...shared,
};

// Database connection
export const queryClient = postgres(config.db.url, {
  onnotice: () => {},
});

export const db = drizzle(queryClient, { schema });

/**
 * Closes the underlying PostgreSQL connection pool.
 * Used by GracefulShutdownManager (Phase 4) for zero-downtime teardown.
 */
export async function closeDatabaseConnection(): Promise<void> {
  await queryClient.end();
}

// Global Enums & Constants
export * from "./schema/enums/iam";
export * from "./schema/enums/experts";
export * from "./schema/enums/common";
export * from "./schema/enums/finance";

// Repositories & Outbox Store
export * from "./repositories/drizzle-outbox.store";
export * from "./repositories/base.repository";

// NOTE: Domain tables are now exported via modular paths:
// @vishwakarma-k-c/db/iam
// @vishwakarma-k-c/db/members
// @vishwakarma-k-c/db/shared
