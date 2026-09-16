import { db } from "@vishwakarma-k-c/db";
import { users } from "@vishwakarma-k-c/db/iam";
import { profiles } from "@vishwakarma-k-c/db/members";
import { eq, and, isNull } from "drizzle-orm";
import { Result, DynamicDomainError } from "@vishwakarma-k-c/shared";

export interface PublicVerificationResult {
  isAuthentic: boolean;
  digitalId: string;
  name: string;
  kula: string;
  trade: string;
  district: string;
  state: string;
  assemblyConstituency: string;
  parliamentaryConstituency: string;
  status: string;
  membershipYear: number;
  verificationTimestamp: string;
  message: string;
}

/**
 * VerifyDigitalIdUseCase
 * Public QR scanner landing query.
 * Verifies authenticity without leaking private contact PII (phone, email, ID hashes).
 */
export class VerifyDigitalIdUseCase {
  public async execute(digitalId: string): Promise<Result<PublicVerificationResult, Error>> {
    const cleanId = (digitalId || "").trim().toUpperCase();

    if (!cleanId.startsWith("VKC")) {
      return Result.fail(
        new DynamicDomainError("INVALID_DIGITAL_ID", "Invalid Digital ID format. Format must be VKC-YYYY-XXXXXX.")
      );
    }

    const [row] = await db
      .select({
        digitalId: profiles.digitalId,
        kula: profiles.kula,
        trade: profiles.trade,
        district: profiles.district,
        mandal: profiles.mandal,
        state: profiles.state,
        assemblyConstituency: profiles.assemblyConstituency,
        parliamentaryConstituency: profiles.parliamentaryConstituency,
        joinedAt: profiles.joinedAt,
        firstName: users.firstName,
        lastName: users.lastName,
        deletedAt: users.deletedAt,
      })
      .from(profiles)
      .innerJoin(users, eq(users.id, profiles.userId))
      .where(
        and(
          eq(profiles.digitalId, cleanId),
          isNull(users.deletedAt)
        )
      )
      .limit(1);

    if (!row || !row.digitalId) {
      return Result.fail(
        new DynamicDomainError(
          "DIGITAL_ID_NOT_FOUND",
          "The scanned Digital ID is not found or is currently inactive. Please check with an on-ground coordinator."
        )
      );
    }

    // Mask name partially for privacy while proving authenticity (e.g. Suresh A.)
    const lastNameMasked = row.lastName ? `${row.lastName.charAt(0)}.` : "";
    const displayName = `${row.firstName || ""} ${lastNameMasked}`.trim();

    return Result.ok({
      isAuthentic: true,
      digitalId: row.digitalId,
      name: displayName || "Community Member",
      kula: row.kula,
      trade: row.trade,
      district: row.district,
      state: row.state,
      assemblyConstituency: row.assemblyConstituency || "N/A",
      parliamentaryConstituency: row.parliamentaryConstituency || "N/A",
      status: "PROVISIONAL_COMMUNITY_MEMBER",
      membershipYear: new Date(row.joinedAt).getFullYear(),
      verificationTimestamp: new Date().toISOString(),
      message: "Official Vishwakarma Community Pass Verified.",
    });
  }
}
