import { db } from "@vishwakarma-k-c/db";
import { profiles } from "@vishwakarma-k-c/db/members";
import { users } from "@vishwakarma-k-c/db/iam";
import { eq, and, isNull, sql } from "drizzle-orm";
import { Result } from "@vishwakarma-k-c/shared";

export interface ConstituencyStrength {
  assemblyConstituency: string;
  parliamentaryConstituency: string;
  totalMembers: number;
  kulaBreakdown: Record<string, number>;
  keyInfluenceIndex: "HIGH" | "MEDIUM" | "EMERGING";
}

export interface VoteBankAnalyticsResult {
  summary: {
    totalRegisteredMembers: number;
    totalConstituenciesCovered: number;
    topConstituency: string;
    ekthaYatraRegistrations: number;
  };
  constituencyLeaderboard: ConstituencyStrength[];
  confidentialNotice: string;
}

/**
 * VoteBankAnalyticsUseCase
 * Strictly confidential leadership intelligence:
 * Aggregates member density across Assembly and Parliamentary Constituencies
 * to calculate collective community voting representation and strategic influence.
 */
export class VoteBankAnalyticsUseCase {
  public async execute(): Promise<Result<VoteBankAnalyticsResult, Error>> {
    // 1. Fetch active profiles grouped by AC, PC, and Kula
    const rows = await db
      .select({
        assemblyConstituency: profiles.assemblyConstituency,
        parliamentaryConstituency: profiles.parliamentaryConstituency,
        kula: profiles.kula,
        source: profiles.source,
        memberCount: sql<number>`count(${profiles.id})::int`,
      })
      .from(profiles)
      .innerJoin(users, eq(users.id, profiles.userId))
      .where(isNull(users.deletedAt))
      .groupBy(
        profiles.assemblyConstituency,
        profiles.parliamentaryConstituency,
        profiles.kula,
        profiles.source
      );

    // 2. Aggregate data by Assembly Constituency
    const acMap = new Map<
      string,
      {
        pc: string;
        total: number;
        kulaMap: Record<string, number>;
      }
    >();

    let totalMembers = 0;
    let ekthaYatraCount = 0;

    for (const r of rows) {
      const ac = r.assemblyConstituency || "Unassigned";
      const pc = r.parliamentaryConstituency || "Unassigned";
      const count = Number(r.memberCount) || 0;

      totalMembers += count;
      if (r.source === "EKTHA_YATRA") {
        ekthaYatraCount += count;
      }

      if (!acMap.has(ac)) {
        acMap.set(ac, { pc, total: 0, kulaMap: {} });
      }

      const entry = acMap.get(ac)!;
      entry.total += count;
      const kula = r.kula || "General";
      entry.kulaMap[kula] = (entry.kulaMap[kula] || 0) + count;
    }

    // 3. Format & Sort Leaderboard by Total Density
    const leaderboard: ConstituencyStrength[] = Array.from(acMap.entries())
      .map(([ac, val]) => {
        let keyInfluenceIndex: "HIGH" | "MEDIUM" | "EMERGING" = "EMERGING";
        if (val.total >= 50) keyInfluenceIndex = "HIGH";
        else if (val.total >= 15) keyInfluenceIndex = "MEDIUM";

        return {
          assemblyConstituency: ac,
          parliamentaryConstituency: val.pc,
          totalMembers: val.total,
          kulaBreakdown: val.kulaMap,
          keyInfluenceIndex,
        };
      })
      .sort((a, b) => b.totalMembers - a.totalMembers);

    const topConstituency = leaderboard.length > 0 ? leaderboard[0].assemblyConstituency : "None";

    return Result.ok({
      summary: {
        totalRegisteredMembers: totalMembers,
        totalConstituenciesCovered: acMap.size,
        topConstituency,
        ekthaYatraRegistrations: ekthaYatraCount,
      },
      constituencyLeaderboard: leaderboard,
      confidentialNotice:
        "STRICTLY CONFIDENTIAL • INTERNAL COMMUNITY REPRESENTATION INTELLIGENCE • NOT FOR PUBLIC REDISTRIBUTION",
    });
  }
}
