import { db } from "@vishwakarma-k-c/db";
import { users } from "@vishwakarma-k-c/db/iam";
import { profiles } from "@vishwakarma-k-c/db/members";
import { eq, and, isNull } from "drizzle-orm";
import { Result, DynamicDomainError, logger } from "@vishwakarma-k-c/shared";
import { GeoConstituencyService } from "../services/geo-constituency.service";

export interface UpdateLocationCommand {
  userPublicId: string;
  latitude?: number;
  longitude?: number;
  wardOrVillage?: string;
}

export interface UpdateLocationResult {
  digitalId: string;
  assemblyConstituency: string;
  parliamentaryConstituency: string;
  wardOrVillage?: string | null;
  geoConfidence: string;
  message: string;
}

/**
 * UpdateLocationUseCase
 * Handles progressive post-registration location and ward refinement from in-app modal.
 */
export class UpdateLocationUseCase {
  public async execute(command: UpdateLocationCommand): Promise<Result<UpdateLocationResult, Error>> {
    const { userPublicId, latitude, longitude, wardOrVillage } = command;

    const [userRow] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.publicId, userPublicId), isNull(users.deletedAt)))
      .limit(1);

    if (!userRow) {
      return Result.fail(new DynamicDomainError("USER_NOT_FOUND", "User not found or inactive."));
    }

    const [profileRow] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userRow.id))
      .limit(1);

    if (!profileRow) {
      return Result.fail(new DynamicDomainError("PROFILE_NOT_FOUND", "Member profile not found."));
    }

    // If coordinates are provided, refine constituency precision
    let refinedAc = profileRow.assemblyConstituency;
    let refinedPc = profileRow.parliamentaryConstituency;
    let geoConfidence = profileRow.geoConfidence;

    if (latitude && longitude) {
      const geoResult = GeoConstituencyService.refineFromCoordinates(latitude, longitude);
      if (geoResult) {
        refinedAc = geoResult.assemblyConstituency;
        refinedPc = geoResult.parliamentaryConstituency;
        geoConfidence = "GPS_REFINED";
      }
    }

    const updateValues: Partial<typeof profiles.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (latitude !== undefined) updateValues.latitude = String(latitude);
    if (longitude !== undefined) updateValues.longitude = String(longitude);
    if (wardOrVillage !== undefined) updateValues.wardOrVillage = wardOrVillage.trim();
    if (refinedAc) updateValues.assemblyConstituency = refinedAc;
    if (refinedPc) updateValues.parliamentaryConstituency = refinedPc;
    if (geoConfidence) updateValues.geoConfidence = geoConfidence;

    await db
      .update(profiles)
      .set(updateValues)
      .where(eq(profiles.id, profileRow.id));

    logger.info(
      {
        userPublicId,
        digitalId: profileRow.digitalId,
        refinedAc,
        refinedPc,
        geoConfidence,
      },
      "Progressive location refined for member"
    );

    return Result.ok({
      digitalId: profileRow.digitalId || "N/A",
      assemblyConstituency: refinedAc || "Unassigned",
      parliamentaryConstituency: refinedPc || "Unassigned",
      wardOrVillage: wardOrVillage?.trim() || profileRow.wardOrVillage,
      geoConfidence,
      message: "Local constituency and artisan ward details refined successfully.",
    });
  }
}
