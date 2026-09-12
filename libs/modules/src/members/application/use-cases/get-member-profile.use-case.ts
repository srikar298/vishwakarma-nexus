import { db } from "@vishwakarma-k-c/db";
import { users } from "@vishwakarma-k-c/db/iam";
import { profiles } from "@vishwakarma-k-c/db/members";
import { eq } from "drizzle-orm";
import { Result, DynamicDomainError } from "@vishwakarma-k-c/shared";

export interface MemberProfileDTO {
  user: {
    publicId: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  profile: {
    digitalId: string;
    phone: string;
    email?: string | null;
    kula: string;
    trade: string;
    district: string;
    mandal?: string | null;
    state: string;
    source: string;
    isVerified: boolean;
    isPaid: boolean;
    photoUrl?: string | null;
    intents?: Record<string, any> | null;
    joinedAt: Date;
  };
}

export class GetMemberProfileUseCase {
  public async execute(userPublicId: string): Promise<Result<MemberProfileDTO, Error>> {
    const [userRow] = await db
      .select()
      .from(users)
      .where(eq(users.publicId, userPublicId))
      .limit(1);

    if (!userRow) {
      return Result.fail(new DynamicDomainError("USER_NOT_FOUND", "User account not found."));
    }

    const [profileRow] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userRow.id))
      .limit(1);

    if (!profileRow) {
      return Result.fail(new DynamicDomainError("PROFILE_NOT_FOUND", "Member profile not found."));
    }

    return Result.ok({
      user: {
        publicId: userRow.publicId,
        firstName: userRow.firstName || "",
        lastName: userRow.lastName || "",
        role: userRow.role,
      },
      profile: {
        digitalId: profileRow.digitalId || "N/A",
        phone: profileRow.phone,
        email: profileRow.email,
        kula: profileRow.kula,
        trade: profileRow.trade,
        district: profileRow.district,
        mandal: profileRow.mandal,
        state: profileRow.state,
        source: profileRow.source,
        isVerified: profileRow.isVerified,
        isPaid: profileRow.isPaid,
        photoUrl: profileRow.photoUrl,
        intents: profileRow.intents as any,
        joinedAt: profileRow.joinedAt,
      },
    });
  }
}
