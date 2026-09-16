import { db } from "@vishwakarma-k-c/db";
import { users } from "@vishwakarma-k-c/db/iam";
import { profiles } from "@vishwakarma-k-c/db/members";
import { eq, and, isNull } from "drizzle-orm";
import { Result, DynamicDomainError } from "@vishwakarma-k-c/shared";
import { DigitalIdCardService } from "../services/digital-id-card.service";

export interface GetIdCardResult {
  digitalId: string;
  svg: string;
  qrVerifyUrl: string;
  whatsAppShareUrl: string;
  metadata: {
    fullName: string;
    kula: string;
    trade: string;
    district: string;
    state: string;
    assemblyConstituency?: string | null;
    parliamentaryConstituency?: string | null;
    status: string;
    joinedYear: number;
  };
}

/**
 * GetIdCardUseCase
 * Authenticated member fetches their dynamic SVG card and WhatsApp sharing payload.
 */
export class GetIdCardUseCase {
  public async execute(userPublicId: string): Promise<Result<GetIdCardResult, Error>> {
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
        isVerified: profiles.isVerified,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .where(
        and(
          eq(users.publicId, userPublicId),
          isNull(users.deletedAt)
        )
      )
      .limit(1);

    if (!row || !row.digitalId) {
      return Result.fail(
        new DynamicDomainError("PROFILE_NOT_FOUND", "Member profile or Digital ID not found.")
      );
    }

    const fullName = `${row.firstName || ""} ${row.lastName || ""}`.trim() || "Community Member";
    const joinedYear = new Date(row.joinedAt).getFullYear();

    const svg = await DigitalIdCardService.generateCardSvg({
      digitalId: row.digitalId,
      fullName,
      kula: row.kula,
      trade: row.trade,
      district: row.district,
      state: row.state,
      assemblyConstituency: row.assemblyConstituency,
      parliamentaryConstituency: row.parliamentaryConstituency,
      joinedYear,
      isVerified: row.isVerified,
    });

    const qrVerifyUrl = `https://nexus.vkc.org/verify/${encodeURIComponent(row.digitalId)}`;
    const whatsAppShareUrl = DigitalIdCardService.getWhatsAppShareUrl(row.digitalId, fullName);

    return Result.ok({
      digitalId: row.digitalId,
      svg,
      qrVerifyUrl,
      whatsAppShareUrl,
      metadata: {
        fullName,
        kula: row.kula,
        trade: row.trade,
        district: row.district,
        state: row.state,
        assemblyConstituency: row.assemblyConstituency,
        parliamentaryConstituency: row.parliamentaryConstituency,
        status: row.isVerified ? "OFFICIAL_MEMBER" : "PROVISIONAL_COMMUNITY_MEMBER",
        joinedYear,
      },
    });
  }
}
