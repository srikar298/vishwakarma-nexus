import { pgSchema, integer, text, boolean, timestamp, varchar, jsonb, numeric, index } from "drizzle-orm/pg-core";
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
  // Internal Electoral & Geographic Representation Fields (Confidential)
  assemblyConstituency: text("assembly_constituency"),
  parliamentaryConstituency: text("parliamentary_constituency"),
  wardOrVillage: text("ward_or_village"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  geoConfidence: varchar("geo_confidence", { length: 25 }).default("MANDAL_RESOLVED").notNull(),
  campaignTag: varchar("campaign_tag", { length: 50 }),
  photoUrl: text("photo_url"),
  idCardUrl: text("id_card_url"),
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
  index("idx_profiles_kula").on(table.kula),
  index("idx_profiles_assembly_constituency").on(table.assemblyConstituency),
  index("idx_profiles_parliamentary_constituency").on(table.parliamentaryConstituency),
]);

export const announcements = memberSchema.table("announcements", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).default("GENERAL").notNull(),
  priority: varchar("priority", { length: 20 }).default("NORMAL").notNull(), // NORMAL, HIGH, URGENT
  targetDistrict: text("target_district"), // null means all districts
  targetKula: text("target_kula"), // null means all kulas
  actionUrl: text("action_url"),
  authorId: integer("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("idx_announcements_created_at").on(table.createdAt),
  index("idx_announcements_target_district").on(table.targetDistrict),
]);

