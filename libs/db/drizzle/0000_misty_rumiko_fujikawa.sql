CREATE SCHEMA "finance_mod";
--> statement-breakpoint
CREATE SCHEMA "auth_mod";
--> statement-breakpoint
CREATE SCHEMA "matrimony_mod";
--> statement-breakpoint
CREATE SCHEMA "member_mod";
--> statement-breakpoint
CREATE SCHEMA "professionals_mod";
--> statement-breakpoint
CREATE SCHEMA "shared_mod";
--> statement-breakpoint
CREATE TYPE "public"."donor_tier" AS ENUM('SILVER', 'GOLD', 'PATRON');--> statement-breakpoint
CREATE TYPE "public"."expert_category" AS ENUM('MEDICAL', 'LEGAL', 'TECH', 'ARCHITECTURE', 'ACADEMIC');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('RAZORPAY', 'STRIPE', 'OFFLINE');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('GUEST', 'MEMBER_BASIC', 'MEMBER_VERIFIED', 'EXPERT', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TYPE "public"."identity_provider" AS ENUM('PHONE', 'EMAIL', 'GOOGLE', 'FACEBOOK', 'APPLE');--> statement-breakpoint
CREATE TABLE "finance_mod"."invoices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "finance_mod"."invoices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" varchar(21) NOT NULL,
	"transaction_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"invoice_number" varchar(50) NOT NULL,
	"url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "finance_mod"."transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "finance_mod"."transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" varchar(21) NOT NULL,
	"user_id" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"status" "transaction_status" DEFAULT 'PENDING' NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"provider_tx_id" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "auth_mod"."identities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "auth_mod"."identities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"provider" "identity_provider" NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"credentialHash" varchar(255),
	"isVerified" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"lastLoginAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_mod"."users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "auth_mod"."users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"publicId" varchar(21) NOT NULL,
	"firstName" text,
	"lastName" text,
	"role" "user_role" DEFAULT 'MEMBER_BASIC' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "users_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
CREATE TABLE "auth_mod"."permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "auth_mod"."permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "auth_mod"."role_permissions" (
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "auth_mod"."roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "auth_mod"."roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(50) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "auth_mod"."user_roles" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "auth_mod"."refreshTokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "auth_mod"."refreshTokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"isRevoked" boolean DEFAULT false NOT NULL,
	"replacedByToken" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refreshTokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "matrimony_mod"."interactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "matrimony_mod"."interactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matrimony_mod"."profiles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "matrimony_mod"."profiles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"kula" text NOT NULL,
	"gotra" text,
	"star" text,
	"raasi" text,
	"height" varchar(20),
	"education" text,
	"profession" text,
	"income" numeric(15, 2),
	"is_verified" boolean DEFAULT false NOT NULL,
	"photo_urls" text[],
	"horoscope_url" text,
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_mod"."announcements" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "member_mod"."announcements_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"category" varchar(50) DEFAULT 'GENERAL' NOT NULL,
	"priority" varchar(20) DEFAULT 'NORMAL' NOT NULL,
	"target_district" text,
	"target_kula" text,
	"action_url" text,
	"author_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "member_mod"."profiles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "member_mod"."profiles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"digital_id" varchar(25),
	"phone" varchar(20) NOT NULL,
	"email" varchar(255),
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"kula" text NOT NULL,
	"trade" text NOT NULL,
	"district" text NOT NULL,
	"mandal" text,
	"state" text DEFAULT 'Telangana' NOT NULL,
	"assembly_constituency" text,
	"parliamentary_constituency" text,
	"ward_or_village" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"geo_confidence" varchar(25) DEFAULT 'MANDAL_RESOLVED' NOT NULL,
	"campaign_tag" varchar(50),
	"photo_url" text,
	"id_card_url" text,
	"source" varchar(50) DEFAULT 'ORGANIC' NOT NULL,
	"intents" jsonb,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "profiles_digital_id_unique" UNIQUE("digital_id")
);
--> statement-breakpoint
CREATE TABLE "professionals_mod"."profiles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "professionals_mod"."profiles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"member_profile_id" integer NOT NULL,
	"category" "expert_category" NOT NULL,
	"experience_years" integer NOT NULL,
	"bio" text,
	"portfolio_urls" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_mod"."auditLogs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shared_mod"."auditLogs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"actorId" integer,
	"action" varchar(50) NOT NULL,
	"entityType" varchar(50) NOT NULL,
	"entityId" varchar(100) NOT NULL,
	"oldData" jsonb,
	"newData" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_mod"."mediaAssets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shared_mod"."mediaAssets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"publicId" varchar(21) NOT NULL,
	"ownerId" integer,
	"bucket" varchar(50) NOT NULL,
	"key" text NOT NULL,
	"mimeType" varchar(100),
	"size" integer,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mediaAssets_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
CREATE TABLE "shared_mod"."otpVerifications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shared_mod"."otpVerifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"identityId" integer NOT NULL,
	"purpose" varchar(50) NOT NULL,
	"codeHash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_mod"."outboxEvents" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"eventName" varchar(100) NOT NULL,
	"aggregateId" varchar(100) NOT NULL,
	"payload" jsonb NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"metadata" jsonb,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"attemptsMade" integer DEFAULT 0 NOT NULL,
	"lastError" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"publishedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "finance_mod"."invoices" ADD CONSTRAINT "invoices_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "finance_mod"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_mod"."invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_mod"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_mod"."transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_mod"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_mod"."identities" ADD CONSTRAINT "identities_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth_mod"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_mod"."role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "auth_mod"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_mod"."role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "auth_mod"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_mod"."user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_mod"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_mod"."user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "auth_mod"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_mod"."refreshTokens" ADD CONSTRAINT "refreshTokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth_mod"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matrimony_mod"."interactions" ADD CONSTRAINT "interactions_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "auth_mod"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matrimony_mod"."interactions" ADD CONSTRAINT "interactions_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "auth_mod"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matrimony_mod"."profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_mod"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_mod"."announcements" ADD CONSTRAINT "announcements_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "auth_mod"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_mod"."profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_mod"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professionals_mod"."profiles" ADD CONSTRAINT "profiles_member_profile_id_profiles_id_fk" FOREIGN KEY ("member_profile_id") REFERENCES "member_mod"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_identities_provider_identifier" ON "auth_mod"."identities" USING btree ("provider","identifier");--> statement-breakpoint
CREATE INDEX "idx_identities_user_id" ON "auth_mod"."identities" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_identities_verified_search" ON "auth_mod"."identities" USING btree ("identifier","provider") WHERE "auth_mod"."identities"."isVerified" = true;--> statement-breakpoint
CREATE INDEX "idx_users_publicId_role" ON "auth_mod"."users" USING btree ("publicId","role","id");--> statement-breakpoint
CREATE INDEX "idx_role_perms_permission_id" ON "auth_mod"."role_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE INDEX "idx_user_roles_role_id" ON "auth_mod"."user_roles" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "idx_announcements_created_at" ON "member_mod"."announcements" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_announcements_target_district" ON "member_mod"."announcements" USING btree ("target_district");--> statement-breakpoint
CREATE INDEX "idx_profiles_phone" ON "member_mod"."profiles" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "idx_profiles_district" ON "member_mod"."profiles" USING btree ("district");--> statement-breakpoint
CREATE INDEX "idx_profiles_kula" ON "member_mod"."profiles" USING btree ("kula");--> statement-breakpoint
CREATE INDEX "idx_profiles_assembly_constituency" ON "member_mod"."profiles" USING btree ("assembly_constituency");--> statement-breakpoint
CREATE INDEX "idx_profiles_parliamentary_constituency" ON "member_mod"."profiles" USING btree ("parliamentary_constituency");--> statement-breakpoint
CREATE INDEX "idx_outbox_status_created" ON "shared_mod"."outboxEvents" USING btree ("status","createdAt");