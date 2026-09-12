import { pgSchema, integer, text, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "../iam/users";
import { expertCategoryEnum } from "../../enums/experts";

export const memberSchema = pgSchema("member_mod");

export const profiles = memberSchema.table("profiles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  digitalId: varchar("digital_id", { length: 25 }).unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  isVerified: boolean("is_verified").default(false).notNull(),
  isPaid: boolean("is_paid").default(false).notNull(),
  kula: text("kula").notNull(), // One of the 5 branches
  trade: text("trade").notNull(), // Specific skill/profession
  district: text("district").notNull(),
  mandal: text("mandal"),
  state: text("state").default("Telangana").notNull(),
  photoUrl: text("photo_url"),
  source: varchar("source", { length: 50 }).default("ORGANIC").notNull(),
  intents: jsonb("intents").$type<{
    matrimony?: boolean;
    businessLeads?: boolean;
    pmVishwakarma?: boolean;
    shastraVaults?: boolean;
    communityEvents?: boolean;
    educationScholarships?: boolean;
    interests?: string[];
  }>(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("idx_profiles_phone").on(table.phone),
  index("idx_profiles_district").on(table.district),
]);
