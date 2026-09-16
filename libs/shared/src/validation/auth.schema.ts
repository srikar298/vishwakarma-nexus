import { z } from "zod";

/**
 * Request OTP Validation
 */
export const requestOtpSchema = z.object({
  identifier: z.string().describe("Phone number or Email address"),
  provider: z.enum(["PHONE", "EMAIL"]).default("PHONE"),
  reason: z.enum(["LOGIN", "REGISTER"]).default("LOGIN"),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

/**
 * Verify OTP Validation
 */
export const verifyOtpSchema = z.object({
  identifier: z.string(),
  code: z.string().length(6, "OTP must be 6 digits"),
  provider: z.enum(["PHONE", "EMAIL"]).default("PHONE"),
  reason: z.enum(["LOGIN", "REGISTER"]).default("LOGIN"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

/**
 * Refresh Token Validation
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

/**
 * Register User (Profile Completion) Validation
 */
export const registerUserSchema = z.object({
  userId: z.string().describe("The user's publicId"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const CommunityInterest = {
  SHASTRA_VAULTS: "SHASTRA_VAULTS",
  MATRIMONY: "MATRIMONY",
  BUSINESS_LEADS: "BUSINESS_LEADS",
  PM_VISHWAKARMA: "PM_VISHWAKARMA",
  COMMUNITY_EVENTS: "COMMUNITY_EVENTS",
  EDUCATION_SCHOLARSHIPS: "EDUCATION_SCHOLARSHIPS",
} as const;

export type CommunityInterestType = (typeof CommunityInterest)[keyof typeof CommunityInterest];

/**
 * Core General Registration Schema
 */
export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  kula: z.string().min(1, "Kula / Sub-caste branch is required"),
  trade: z.string().min(1, "Trade or profession is required"),
  district: z.string().min(1, "District is required"),
  mandal: z.string().optional(),
  state: z.string().default("Telangana"),
  mpin: z.string().regex(/^\d{4,6}$/, "MPIN must be 4 to 6 digits"),
  source: z.enum(["ORGANIC", "EKTHA_YATRA", "WEB", "REFERRAL"]).default("ORGANIC"),
  campaignTag: z.string().max(50).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  interests: z.array(z.string()).optional().default([]),
  intents: z.object({
    matrimony: z.boolean().optional(),
    businessLeads: z.boolean().optional(),
    pmVishwakarma: z.boolean().optional(),
    shastraVaults: z.boolean().optional(),
    communityEvents: z.boolean().optional(),
    educationScholarships: z.boolean().optional(),
    selectedInterests: z.array(z.string()).optional(),
  }).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Core Dual-Identifier Login Schema (Phone or Digital ID + MPIN)
 */
export const loginSchema = z.object({
  identifier: z.string().min(3, "Phone number or Digital ID is required"),
  mpin: z.string().regex(/^\d{4,6}$/, "MPIN must be 4 to 6 digits"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Self-Serve Contact Update Schema
 */
export const updateContactSchema = z.object({
  phone: z.string().min(10).max(15).optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
});

export type UpdateContactInput = z.infer<typeof updateContactSchema>;

/**
 * Demographic Challenge Self-Reset MPIN Schema
 * Allows zero-SMS self-reset by verifying user's demographic profile (Kula + District)
 */
export const resetMpinChallengeSchema = z.object({
  identifier: z.string().min(3, "Phone number or Digital ID is required"),
  kula: z.string().min(1, "Kula / Sub-caste branch is required for identity verification"),
  district: z.string().min(1, "District is required for identity verification"),
  newMpin: z.string().regex(/^\d{4,6}$/, "New MPIN must be 4 to 6 digits"),
});

export type ResetMpinChallengeInput = z.infer<typeof resetMpinChallengeSchema>;

/**
 * Coordinator On-Ground MPIN Reset Schema
 * Used by authorized Ektha Yatra volunteers / coordinators at helpdesks
 */
export const coordinatorResetMpinSchema = z.object({
  newMpin: z.string().regex(/^\d{4,6}$/, "Temporary MPIN must be 4 to 6 digits"),
  reason: z.string().min(3, "Reason for manual reset is required (e.g. Yatra Helpdesk Verification)"),
});

export type CoordinatorResetMpinInput = z.infer<typeof coordinatorResetMpinSchema>;

/**
 * Authenticated Change MPIN Schema
 */
export const changeMpinSchema = z.object({
  currentMpin: z.string().regex(/^\d{4,6}$/, "Current MPIN must be 4 to 6 digits"),
  newMpin: z.string().regex(/^\d{4,6}$/, "New MPIN must be 4 to 6 digits"),
});

export type ChangeMpinInput = z.infer<typeof changeMpinSchema>;

/**
 * Progressive Location & Ward Update Schema
 */
export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  wardOrVillage: z.string().max(100).optional(),
});

export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;

/**
 * Community Announcement Broadcast Schema
 */
export const createAnnouncementSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(5),
  category: z.enum(["GENERAL", "EKTHA_YATRA", "GOVERNMENT_SCHEME", "COMMUNITY_EVENT"]).default("GENERAL"),
  priority: z.enum(["NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  targetDistrict: z.string().optional(),
  targetKula: z.string().optional(),
  actionUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().optional(),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;


