import { db } from "@vishwakarma-k-c/db";
import { announcements } from "@vishwakarma-k-c/db/members";
import { users } from "@vishwakarma-k-c/db/iam";
import { desc, isNull, eq, and, or, sql } from "drizzle-orm";
import { Result, DynamicDomainError, auditLogger, logger } from "@vishwakarma-k-c/shared";

export interface CreateAnnouncementCommand {
  authorPublicId: string;
  title: string;
  content: string;
  category?: "GENERAL" | "EKTHA_YATRA" | "GOVERNMENT_SCHEME" | "COMMUNITY_EVENT";
  priority?: "NORMAL" | "HIGH" | "URGENT";
  targetDistrict?: string;
  targetKula?: string;
  actionUrl?: string;
  expiresAt?: string;
}

export interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: string;
  targetDistrict?: string | null;
  targetKula?: string | null;
  actionUrl?: string | null;
  createdAt: string;
}

/**
 * AnnouncementsUseCase
 * Handles publishing official broadcasts and fetching active announcements for members.
 */
export class AnnouncementsUseCase {
  public async create(command: CreateAnnouncementCommand): Promise<Result<AnnouncementItem, Error>> {
    const {
      authorPublicId,
      title,
      content,
      category = "GENERAL",
      priority = "NORMAL",
      targetDistrict,
      targetKula,
      actionUrl,
      expiresAt,
    } = command;

    const [author] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.publicId, authorPublicId), isNull(users.deletedAt)))
      .limit(1);

    const [row] = await db
      .insert(announcements)
      .values({
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        targetDistrict: targetDistrict?.trim() || null,
        targetKula: targetKula?.trim() || null,
        actionUrl: actionUrl?.trim() || null,
        authorId: author?.id || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning();

    await auditLogger.log({
      action: "COMMUNITY_ANNOUNCEMENT_PUBLISHED",
      resourceType: "COMMUNITY",
      targetId: String(row.id),
      userId: authorPublicId,
      severity: "INFO",
      metadata: {
        title,
        category,
        priority,
        targetDistrict,
      },
    });

    logger.info({ announcementId: row.id, title }, "New community announcement published");

    return Result.ok({
      id: row.id,
      title: row.title,
      content: row.content,
      category: row.category,
      priority: row.priority,
      targetDistrict: row.targetDistrict,
      targetKula: row.targetKula,
      actionUrl: row.actionUrl,
      createdAt: row.createdAt.toISOString(),
    });
  }

  public async getActive(district?: string, kula?: string): Promise<Result<AnnouncementItem[], Error>> {
    const conditions = [isNull(announcements.deletedAt)];

    if (district) {
      conditions.push(
        or(
          isNull(announcements.targetDistrict),
          eq(sql`LOWER(${announcements.targetDistrict})`, district.trim().toLowerCase())
        )!
      );
    }

    if (kula) {
      conditions.push(
        or(
          isNull(announcements.targetKula),
          eq(sql`LOWER(${announcements.targetKula})`, kula.trim().toLowerCase())
        )!
      );
    }

    const rows = await db
      .select()
      .from(announcements)
      .where(and(...conditions))
      .orderBy(desc(announcements.createdAt))
      .limit(20);

    const items: AnnouncementItem[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      content: r.content,
      category: r.category,
      priority: r.priority,
      targetDistrict: r.targetDistrict,
      targetKula: r.targetKula,
      actionUrl: r.actionUrl,
      createdAt: r.createdAt.toISOString(),
    }));

    return Result.ok(items);
  }
}
