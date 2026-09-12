import { db } from "@vishwakarma-k-c/db";
import { users } from "@vishwakarma-k-c/db/iam";
import { profiles } from "@vishwakarma-k-c/db/members";
import { eq, ilike, or, and, desc } from "drizzle-orm";
import { Result } from "@vishwakarma-k-c/shared";

export interface SearchMembersQuery {
  query?: string;
  district?: string;
  kula?: string;
  source?: string;
  limit?: number;
  offset?: number;
}

export interface MemberSearchResultItem {
  userId: string;
  fullName: string;
  digitalId: string;
  phone: string;
  kula: string;
  trade: string;
  district: string;
  mandal?: string | null;
  source: string;
  isVerified: boolean;
  joinedAt: Date;
}

export class SearchMembersUseCase {
  public async execute(params: SearchMembersQuery): Promise<Result<{ items: MemberSearchResultItem[]; count: number }, Error>> {
    const { 
      query, 
      district, 
      kula, 
      source, 
      limit = 20, 
      offset = 0 
    } = params;

    const conditions: any[] = [];

    if (query?.trim()) {
      const pattern = `%${query.trim()}%`;
      conditions.push(
        or(
          ilike(users.firstName, pattern),
          ilike(users.lastName, pattern),
          ilike(profiles.phone, pattern),
          ilike(profiles.digitalId, pattern),
          ilike(profiles.mandal, pattern)
        )
      );
    }

    if (district?.trim()) {
      conditions.push(ilike(profiles.district, `%${district.trim()}%`));
    }

    if (kula?.trim()) {
      conditions.push(eq(profiles.kula, kula.trim()));
    }

    if (source?.trim()) {
      conditions.push(eq(profiles.source, source.trim()));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select({
        userPublicId: users.publicId,
        firstName: users.firstName,
        lastName: users.lastName,
        digitalId: profiles.digitalId,
        phone: profiles.phone,
        kula: profiles.kula,
        trade: profiles.trade,
        district: profiles.district,
        mandal: profiles.mandal,
        source: profiles.source,
        isVerified: profiles.isVerified,
        joinedAt: profiles.joinedAt,
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(whereClause)
      .orderBy(desc(profiles.joinedAt))
      .limit(Math.min(limit, 100))
      .offset(offset);

    const items: MemberSearchResultItem[] = rows.map((r) => ({
      userId: r.userPublicId,
      fullName: `${r.firstName || ""} ${r.lastName || ""}`.trim(),
      digitalId: r.digitalId || "N/A",
      phone: r.phone,
      kula: r.kula,
      trade: r.trade,
      district: r.district,
      mandal: r.mandal,
      source: r.source,
      isVerified: r.isVerified,
      joinedAt: r.joinedAt,
    }));

    return Result.ok({
      items,
      count: items.length,
    });
  }
}
