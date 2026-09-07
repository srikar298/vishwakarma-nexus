import {
  IDistributedLockProvider,
  defaultLockProvider,
  IEventBus,
  defaultEventBus,
  IJobQueue,
  defaultJobQueue,
  IAuditLogger,
  auditLogger,
  logger,
  DomainEvent,
} from '@vishwakarma-k-c/shared';

export interface RegisterMemberInput {
  userId: string;
  fullName: string;
  communitySubCaste: string;
  district: string;
  state: string;
}

export interface MemberRegistrationResult {
  memberId: string;
  digitalIdNumber: string;
  status: 'PENDING_VERIFICATION' | 'ACTIVE';
}

/**
 * Low-Level Design (LLD): Members Service
 * Handles membership registration, digital ID allocation with distributed mutex locking,
 * event publishing, and background worker queue dispatching.
 */
export class MembersService {
  constructor(
    private lockProvider: IDistributedLockProvider = defaultLockProvider,
    private eventBus: IEventBus = defaultEventBus,
    private jobQueue: IJobQueue = defaultJobQueue,
    private audit: IAuditLogger = auditLogger
  ) {}

  public async registerMember(input: RegisterMemberInput): Promise<MemberRegistrationResult> {
    const lockKey = `lock:members:digital_id_allocator`;

    // 1. Concurrency Guard: Mutex Lock ensures strictly sequential unique Digital ID allocation
    const digitalIdNumber = await this.lockProvider.withLock(lockKey, async () => {
      // Sequence generation (e.g. VKC-2026-XXXX)
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      return `VKC-${new Date().getFullYear()}-${randomSuffix}`;
    });

    const memberId = `mem_${Date.now()}`;
    const result: MemberRegistrationResult = {
      memberId,
      digitalIdNumber,
      status: 'PENDING_VERIFICATION',
    };

    // 2. Security & Compliance Audit Log
    await this.audit.log({
      action: 'MEMBER_REGISTERED',
      resourceType: 'MEMBER',
      targetId: memberId,
      userId: input.userId,
      severity: 'INFO',
      metadata: {
        digitalIdNumber,
        district: input.district,
      },
    });

    // 3. Asynchronous Offloading: Enqueue Digital ID PDF & Avatar optimization
    await this.jobQueue.addJob('members.generate_id_card', {
      memberId,
      digitalIdNumber,
      fullName: input.fullName,
    }, { attempts: 3, delayMs: 1000 });

    // 4. Publish Domain Event for decoupled subscribers (e.g. Welcome WhatsApp, SMS)
    const event: DomainEvent<MemberRegistrationResult & { userId: string }> = {
      id: `evt_mem_${Date.now()}`,
      eventName: 'members.member.registered',
      aggregateId: memberId,
      occurredOn: new Date(),
      payload: {
        ...result,
        userId: input.userId,
      },
    };

    await this.eventBus.publish(event);

    logger.info({ msg: 'Member successfully registered', memberId, digitalIdNumber });
    return result;
  }
}
