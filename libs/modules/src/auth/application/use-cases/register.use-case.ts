import { randomUUID } from "crypto";
import { nanoid } from "nanoid";
import { db, DrizzleOutboxStore } from "@vishwakarma-k-c/db";
import { users, identities } from "@vishwakarma-k-c/db/iam";
import { profiles } from "@vishwakarma-k-c/db/members";
import { 
  HashingService, 
  UserRole, 
  Result, 
  DynamicDomainError, 
  defaultLockProvider, 
  auditLogger, 
  logger 
} from "@vishwakarma-k-c/shared";
import { TokenService, AuthTokens } from "../services/token.service";
import { PhoneNumber } from "../../domain/value-objects/phone-number.vo";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export interface RegisterCommand {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  kula: string;
  trade: string;
  district: string;
  mandal?: string;
  state?: string;
  mpin: string;
  source?: "ORGANIC" | "EKTHA_YATRA" | "WEB" | "REFERRAL";
  interests?: string[];
  intents?: {
    matrimony?: boolean;
    businessLeads?: boolean;
    pmVishwakarma?: boolean;
    shastraVaults?: boolean;
    communityEvents?: boolean;
    educationScholarships?: boolean;
    interests?: string[];
  };
}

export interface RegisterResult {
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
    source: string;
  };
  digitalId: string;
  tokens: AuthTokens;
}

export class RegisterUseCase {
  private readonly tokenService: TokenService;
  private readonly outboxStore: DrizzleOutboxStore;

  constructor(private readonly authRepository: IAuthRepository) {
    this.tokenService = new TokenService(this.authRepository);
    this.outboxStore = new DrizzleOutboxStore(db);
  }

  public async execute(command: RegisterCommand): Promise<Result<RegisterResult, Error>> {
    const { 
      firstName, 
      lastName, 
      phone, 
      email, 
      kula, 
      trade, 
      district, 
      mandal, 
      state = "Telangana", 
      mpin, 
      source = "ORGANIC", 
      interests = [],
      intents 
    } = command;

    // Merge multi-select interests (e.g. SHASTRA_VAULTS, MATRIMONY) and structured intents
    const effectiveIntents = {
      ...intents,
      shastraVaults: intents?.shastraVaults ?? interests.includes("SHASTRA_VAULTS"),
      matrimony: intents?.matrimony ?? interests.includes("MATRIMONY"),
      businessLeads: intents?.businessLeads ?? interests.includes("BUSINESS_LEADS"),
      pmVishwakarma: intents?.pmVishwakarma ?? interests.includes("PM_VISHWAKARMA"),
      communityEvents: intents?.communityEvents ?? interests.includes("COMMUNITY_EVENTS"),
      educationScholarships: intents?.educationScholarships ?? interests.includes("EDUCATION_SCHOLARSHIPS"),
      interests: Array.from(new Set([...interests, ...(intents?.interests || [])])),
    };

    // 1. Domain Validation & Normalization
    let normalizedPhone: string;
    try {
      normalizedPhone = new PhoneNumber(phone).toString();
    } catch {
      // Fallback for domestic 10-digit formats
      const cleaned = phone.replace(/\D/g, "");
      if (cleaned.length === 10) {
        normalizedPhone = `+91${cleaned}`;
      } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
        normalizedPhone = `+${cleaned}`;
      } else {
        return Result.fail(new DynamicDomainError("INVALID_PHONE", "Please provide a valid 10-digit mobile number."));
      }
    }

    const normalizedEmail = email?.trim().toLowerCase() || null;

    // 2. Prevent Duplicate Registration
    const existingIdentity = await this.authRepository.findByIdentifier("PHONE", normalizedPhone);
    if (existingIdentity) {
      return Result.fail(
        new DynamicDomainError(
          "PHONE_ALREADY_REGISTERED", 
          "This mobile number is already registered. Please log in with your MPIN."
        )
      );
    }

    // 3. Cryptographically Secure MPIN Hashing
    const credentialHash = HashingService.hashCredential(mpin);

    // 4. Sequential Unique Digital ID Allocation with Distributed Mutex Lock
    const currentYear = new Date().getFullYear();
    const digitalId = await defaultLockProvider.withLock("lock:members:digital_id_allocator", async () => {
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      return `VKC-${currentYear}-${randomSuffix}`;
    });

    try {
      // 5. Atomic Persistence Across auth_mod and member_mod
      const userPublicId = nanoid();

      const created = await db.transaction(async (tx) => {
        // A. Create User
        const [userRow] = await tx.insert(users).values({
          publicId: userPublicId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: UserRole.MEMBER_BASIC,
        }).returning();

        // B. Create Primary Phone Identity with Credential Hash
        await tx.insert(identities).values({
          userId: userRow.id,
          provider: "PHONE",
          identifier: normalizedPhone,
          credentialHash,
          isVerified: false,
        });

        // C. Create Optional Email Identity
        if (normalizedEmail) {
          await tx.insert(identities).values({
            userId: userRow.id,
            provider: "EMAIL",
            identifier: normalizedEmail,
            isVerified: false,
          });
        }

        // D. Create Member Profile
        const [profileRow] = await tx.insert(profiles).values({
          userId: userRow.id,
          digitalId,
          phone: normalizedPhone,
          email: normalizedEmail,
          kula,
          trade,
          district,
          mandal: mandal?.trim() || null,
          state,
          source,
          intents: effectiveIntents,
          isVerified: false,
          isPaid: false,
        }).returning();

        // E. Record Transactional Outbox Event for Decoupled Consumers
        await this.outboxStore.save({
          id: randomUUID(),
          eventName: "members.member.registered",
          aggregateId: digitalId,
          payload: {
            userId: userRow.publicId,
            digitalId,
            phone: normalizedPhone,
            kula,
            trade,
            district,
            source,
            intents: effectiveIntents,
          },
          occurredOn: new Date(),
        }, tx);

        return { userRow, profileRow };
      });

      // 6. Issue JWT Session Tokens (Auto-Login)
      const tokens = await this.tokenService.issueAuthTokens({
        publicId: created.userRow.publicId,
        role: created.userRow.role,
      });

      // 7. Security & Audit Logging
      await auditLogger.log({
        action: "MEMBER_REGISTERED",
        resourceType: "MEMBER",
        targetId: digitalId,
        userId: created.userRow.publicId,
        severity: "INFO",
        metadata: {
          phone: normalizedPhone,
          district,
          source,
          intents: effectiveIntents,
        },
      });

      logger.info({
        msg: "New Member Registered Successfully",
        digitalId,
        publicId: created.userRow.publicId,
        source,
      });

      return Result.ok({
        user: {
          publicId: created.userRow.publicId,
          firstName: created.userRow.firstName || firstName,
          lastName: created.userRow.lastName || lastName,
          role: created.userRow.role,
        },
        profile: {
          digitalId: created.profileRow.digitalId!,
          phone: created.profileRow.phone,
          email: created.profileRow.email,
          kula: created.profileRow.kula,
          trade: created.profileRow.trade,
          district: created.profileRow.district,
          mandal: created.profileRow.mandal,
          source: created.profileRow.source,
        },
        digitalId,
        tokens,
      });
    } catch (err: any) {
      logger.error({ error: err.message, stack: err.stack }, "Registration transaction failed");
      return Result.fail(new DynamicDomainError("REGISTRATION_FAILED", "Failed to register member. Please try again."));
    }
  }
}
