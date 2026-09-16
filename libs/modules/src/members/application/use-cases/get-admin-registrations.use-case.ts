import { db } from "@vishwakarma-k-c/db";
import { profiles } from "@vishwakarma-k-c/db/members";
import { users } from "@vishwakarma-k-c/db/iam";
import { and, isNull, desc, eq, or, ilike, sql } from "drizzle-orm";
import { Result } from "@vishwakarma-k-c/shared";

export interface AdminRegistrationsQuery {
  source?: string;
  district?: string;
  kula?: string;
  intent?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface RegisteredMemberRecord {
  userPublicId: string;
  digitalId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  kula: string;
  trade: string;
  district: string;
  mandal?: string | null;
  state: string;
  assemblyConstituency?: string | null;
  parliamentaryConstituency?: string | null;
  geoConfidence?: string | null;
  campaignTag?: string | null;
  source: string;
  intents?: any;
  joinedAt: string;
}

export interface AdminRegistrationsResult {
  total: number;
  page: number;
  limit: number;
  members: RegisteredMemberRecord[];
}

/**
 * GetAdminRegistrationsUseCase
 * Leadership & Coordinator intake roster for recently registered members,
 * with deep filters for Ektha Yatra campaigns, districts, and selected multi-intents.
 */
export class GetAdminRegistrationsUseCase {
  public async execute(query: AdminRegistrationsQuery): Promise<Result<AdminRegistrationsResult, Error>> {
    const {
      source,
      district,
      kula,
      intent,
      search,
      limit = 25,
      offset = 0,
    } = query;

    const conditions = [isNull(users.deletedAt)];

    if (source) {
      conditions.push(eq(profiles.source, source.toUpperCase()));
    }

    if (district) {
      conditions.push(eq(sql`LOWER(${profiles.district})`, district.trim().toLowerCase()));
    }

    if (kula) {
      conditions.push(eq(sql`LOWER(${profiles.kula})`, kula.trim().toLowerCase()));
    }

    if (search) {
      const term = `%${search.trim().toLowerCase()}%`;
      conditions.push(
        or(
          ilike(profiles.digitalId, term),
          ilike(profiles.phone, term),
          ilike(users.firstName, term),
          ilike(users.lastName, term)
        )!
      );
    }

    if (intent) {
      const cleanIntent = intent.trim();
      conditions.push(sql`${profiles.intents}->>${cleanIntent} = 'true'`);
    }

    const whereClause = and(...conditions);

    // Fetch records
    const rows = await db
      .select({
        userPublicId: users.publicId,
        firstName: users.firstName,
        lastName: users.lastName,
        digitalId: profiles.digitalId,
        phone: profiles.phone,
        email: profiles.email,
        kula: profiles.kula,
        trade: profiles.trade,
        district: profiles.district,
        mandal: profiles.mandal,
        state: profiles.state,
        assemblyConstituency: profiles.assemblyConstituency,
        parliamentaryConstituency: profiles.parliamentaryConstituency,
        geoConfidence: profiles.geoConfidence,
        campaignTag: profiles.campaignTag,
        source: profiles.source,
        intents: profiles.intents,
        joinedAt: profiles.joinedAt,
      })
      .from(profiles)
      .innerJoin(users, eq(users.id, profiles.userId))
      .where(whereClause)
      .orderBy(desc(profiles.joinedAt))
      .limit(limit)
      .offset(offset);

    // Count query
    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(${profiles.id})::int` })
      .from(profiles)
      .innerJoin(users, eq(users.id, profiles.userId))
      .where(whereClause);

    const members: RegisteredMemberRecord[] = rows.map((r) => ({
      userPublicId: r.userPublicId,
      digitalId: r.digitalId || "N/A",
      fullName: `${r.firstName || ""} ${r.lastName || ""}`.trim() || "Community Member",
      phone: r.phone,
      email: r.email,
      kula: r.kula,
      trade: r.trade,
      district: r.district,
      mandal: r.mandal,
      state: r.state,
      assemblyConstituency: r.assemblyConstituency,
      parliamentaryConstituency: r.parliamentaryConstituency,
      geoConfidence: r.geoConfidence,
      campaignTag: r.campaignTag,
      source: r.source,
      intents: r.intents,
      joinedAt: r.joinedAt.toISOString(),
    }));

    const currentPage = Math.floor(offset / limit) + 1;

    return Result.ok({
      total: totalCount || 0,
      page: currentPage,
      limit,
      members,
    });
  }
}
