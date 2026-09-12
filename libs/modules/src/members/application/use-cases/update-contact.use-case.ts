import { db } from "@vishwakarma-k-c/db";
import { users, identities } from "@vishwakarma-k-c/db/iam";
import { profiles } from "@vishwakarma-k-c/db/members";
import { eq, and, ne } from "drizzle-orm";
import { 
  Result, 
  DynamicDomainError, 
  auditLogger, 
  logger 
} from "@vishwakarma-k-c/shared";

export interface UpdateContactCommand {
  userPublicId: string;
  phone?: string;
  email?: string;
}

export interface UpdateContactResult {
  phone: string;
  email?: string | null;
  digitalId: string;
  isVerified: boolean;
}

export class UpdateContactUseCase {
  public async execute(command: UpdateContactCommand): Promise<Result<UpdateContactResult, Error>> {
    const { userPublicId, phone, email } = command;

    if (!phone && email === undefined) {
      return Result.fail(new DynamicDomainError("NO_CHANGES", "No contact details provided to update."));
    }

    // 1. Resolve User
    const [userRow] = await db
      .select()
      .from(users)
      .where(eq(users.publicId, userPublicId))
      .limit(1);

    if (!userRow) {
      return Result.fail(new DynamicDomainError("USER_NOT_FOUND", "User account not found."));
    }

    // 2. Fetch Current Profile
    const [profileRow] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userRow.id))
      .limit(1);

    if (!profileRow) {
      return Result.fail(new DynamicDomainError("PROFILE_NOT_FOUND", "Member profile not found."));
    }

    let normalizedPhone: string | undefined;
    if (phone) {
      const cleaned = phone.replace(/\D/g, "");
      if (cleaned.length === 10) {
        normalizedPhone = `+91${cleaned}`;
      } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
        normalizedPhone = `+${cleaned}`;
      } else if (phone.startsWith("+") && cleaned.length >= 10) {
        normalizedPhone = phone.trim();
      } else {
        return Result.fail(new DynamicDomainError("INVALID_PHONE", "Please provide a valid 10-digit mobile number."));
      }

      // Check if new phone is already registered by another user
      const existing = await db
        .select()
        .from(identities)
        .where(
          and(
            eq(identities.provider, "PHONE"),
            eq(identities.identifier, normalizedPhone),
            ne(identities.userId, userRow.id)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return Result.fail(
          new DynamicDomainError("PHONE_ALREADY_IN_USE", "This mobile number is already in use by another member.")
        );
      }
    }

    const normalizedEmail = email !== undefined 
      ? (email.trim().toLowerCase() || null) 
      : undefined;

    // 3. Atomically Update Identities & Profile
    await db.transaction(async (tx) => {
      // Update Phone Identity if changed
      if (normalizedPhone && normalizedPhone !== profileRow.phone) {
        await tx
          .update(identities)
          .set({
            identifier: normalizedPhone,
            isVerified: false, // Reset verification status
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(identities.userId, userRow.id),
              eq(identities.provider, "PHONE")
            )
          );

        // Audit Log Phone Change
        await auditLogger.log({
          action: "PHONE_NUMBER_UPDATED",
          resourceType: "MEMBER",
          targetId: profileRow.digitalId || String(userRow.id),
          userId: userPublicId,
          severity: "WARNING",
          metadata: {
            oldPhone: profileRow.phone,
            newPhone: normalizedPhone,
          },
        });
      }

      // Update or Insert Email Identity if provided
      if (normalizedEmail !== undefined) {
        const emailIdentities = await tx
          .select()
          .from(identities)
          .where(
            and(
              eq(identities.userId, userRow.id),
              eq(identities.provider, "EMAIL")
            )
          )
          .limit(1);

        if (emailIdentities.length > 0) {
          if (normalizedEmail) {
            await tx
              .update(identities)
              .set({
                identifier: normalizedEmail,
                isVerified: false,
                updatedAt: new Date(),
              })
              .where(eq(identities.id, emailIdentities[0].id));
          } else {
            // Deleted email
            await tx
              .delete(identities)
              .where(eq(identities.id, emailIdentities[0].id));
          }
        } else if (normalizedEmail) {
          await tx.insert(identities).values({
            userId: userRow.id,
            provider: "EMAIL",
            identifier: normalizedEmail,
            isVerified: false,
          });
        }
      }

      // Update Member Profile
      const updatePayload: Record<string, any> = {
        updatedAt: new Date(),
      };
      if (normalizedPhone) updatePayload.phone = normalizedPhone;
      if (normalizedEmail !== undefined) updatePayload.email = normalizedEmail;

      await tx
        .update(profiles)
        .set(updatePayload)
        .where(eq(profiles.id, profileRow.id));
    });

    logger.info({
      msg: "Member Contact Information Updated",
      userPublicId,
      digitalId: profileRow.digitalId,
      phoneUpdated: !!normalizedPhone,
      emailUpdated: normalizedEmail !== undefined,
    });

    return Result.ok({
      phone: normalizedPhone || profileRow.phone,
      email: normalizedEmail !== undefined ? normalizedEmail : profileRow.email,
      digitalId: profileRow.digitalId || "N/A",
      isVerified: false,
    });
  }
}
