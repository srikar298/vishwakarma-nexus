import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/**/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Whitelist of modular schemas across all business domains
  schemaFilter: [
    "public",
    "auth_mod",
    "member_mod",
    "finance_mod",
    "matrimony_mod",
    "professionals_mod",
    "shared_mod",
  ],
  strict: true,
  verbose: true,
});
