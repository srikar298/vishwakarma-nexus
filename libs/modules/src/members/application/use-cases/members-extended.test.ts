import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VerifyDigitalIdUseCase } from './verify-digital-id.use-case';
import { UpdateLocationUseCase } from './update-location.use-case';
import { GetIdCardUseCase } from './get-id-card.use-case';
import { VoteBankAnalyticsUseCase } from './vote-bank-analytics.use-case';
import { AnnouncementsUseCase } from './announcements.use-case';
import { SuspendMemberUseCase } from './suspend-member.use-case';

const { sampleMemberData, sampleAnnouncement } = vi.hoisted(() => {
  return {
    sampleMemberData: {
      id: 101,
      userId: 101,
      publicId: 'usr_mem_456',
      firstName: 'Suresh',
      lastName: 'Achary',
      role: 'MEMBER_BASIC',
      digitalId: 'VKC-2026-100042',
      phone: '+919123456780',
      email: 'suresh@example.com',
      kula: 'Shilpi',
      trade: 'Temple Sthapathi',
      district: 'Karimnagar',
      mandal: 'Vemulawada',
      state: 'Telangana',
      assemblyConstituency: 'Vemulawada',
      parliamentaryConstituency: 'Karimnagar',
      geoConfidence: 'MANDAL_RESOLVED',
      isVerified: false,
      joinedAt: new Date('2026-09-01'),
    },
    sampleAnnouncement: {
      id: 1,
      title: 'Ektha Yatra Grand Rally in Karimnagar',
      content: 'Join us at the town hall for artisan felicitations.',
      category: 'EKTHA_YATRA',
      priority: 'HIGH',
      targetDistrict: 'Karimnagar',
      targetKula: null,
      actionUrl: 'https://nexus.vkc.org/events/yatra',
      createdAt: new Date('2026-09-10'),
    },
  };
});

// Mock DB for Extended Members tests
vi.mock('@vishwakarma-k-c/db', () => {
  const mockTx = {
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
  };

  return {
    db: {
      transaction: vi.fn((callback) => callback(mockTx)),
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            limit: vi.fn().mockResolvedValue([sampleMemberData]),
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([sampleAnnouncement]),
            }),
          })),
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([sampleMemberData]),
              groupBy: vi.fn().mockResolvedValue([
                {
                  assemblyConstituency: 'Vemulawada',
                  parliamentaryConstituency: 'Karimnagar',
                  kula: 'Shilpi',
                  source: 'EKTHA_YATRA',
                  memberCount: 42,
                },
                {
                  assemblyConstituency: 'Warangal West',
                  parliamentaryConstituency: 'Warangal',
                  kula: 'Vishvajna',
                  source: 'ORGANIC',
                  memberCount: 28,
                },
              ]),
            }),
          }),
        })),
      })),
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([sampleAnnouncement]),
        }),
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      }),
    },
  };
});

vi.mock('@vishwakarma-k-c/shared', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    auditLogger: {
      log: vi.fn().mockResolvedValue({}),
    },
    cacheProvider: {
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(undefined),
    },
  };
});

describe('Members Extended Flows', () => {
  let verifyDigitalIdUseCase: VerifyDigitalIdUseCase;
  let updateLocationUseCase: UpdateLocationUseCase;
  let getIdCardUseCase: GetIdCardUseCase;
  let voteBankAnalyticsUseCase: VoteBankAnalyticsUseCase;
  let announcementsUseCase: AnnouncementsUseCase;
  let suspendMemberUseCase: SuspendMemberUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    verifyDigitalIdUseCase = new VerifyDigitalIdUseCase();
    updateLocationUseCase = new UpdateLocationUseCase();
    getIdCardUseCase = new GetIdCardUseCase();
    voteBankAnalyticsUseCase = new VoteBankAnalyticsUseCase();
    announcementsUseCase = new AnnouncementsUseCase();

    const mockAuthRepo: any = {
      findByPublicId: vi.fn().mockResolvedValue({
        id: 101,
        publicId: 'usr_mem_456',
      }),
    };
    suspendMemberUseCase = new SuspendMemberUseCase(mockAuthRepo);
  });

  describe('VerifyDigitalIdUseCase', () => {
    it('should return sanitized verification details without raw phone or email', async () => {
      const result = await verifyDigitalIdUseCase.execute('VKC-2026-100042');

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.isAuthentic).toBe(true);
      expect(data.digitalId).toBe('VKC-2026-100042');
      expect(data.name).toBe('Suresh A.'); // Masked last name initial
      expect(data.kula).toBe('Shilpi');
      expect(data.trade).toBe('Temple Sthapathi');
      expect(data.assemblyConstituency).toBe('Vemulawada');
      expect((data as any).phone).toBeUndefined(); // PII guarded
      expect((data as any).email).toBeUndefined(); // PII guarded
    });

    it('should reject invalid digital ID prefix', async () => {
      const result = await verifyDigitalIdUseCase.execute('INVALID-PREFIX-123');

      expect(result.isFailure).toBe(true);
      expect((result.getError() as any).code).toBe('INVALID_DIGITAL_ID');
    });
  });

  describe('UpdateLocationUseCase', () => {
    it('should refine location and constituency from in-app coordinates modal', async () => {
      const result = await updateLocationUseCase.execute({
        userPublicId: 'usr_mem_456',
        latitude: 18.4386,
        longitude: 79.1288,
        wardOrVillage: 'Artisan Colony Ward 4',
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.assemblyConstituency).toBe('Karimnagar');
      expect(data.geoConfidence).toBe('GPS_REFINED');
      expect(data.wardOrVillage).toBe('Artisan Colony Ward 4');
    });
  });

  describe('GetIdCardUseCase', () => {
    it('should generate dynamic in-memory SVG card and WhatsApp share URL', async () => {
      const result = await getIdCardUseCase.execute('usr_mem_456');

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.svg).toContain('<svg');
      expect(data.svg).toContain('VKC-2026-100042');
      expect(data.svg).toContain('Suresh Achary');
      expect(data.whatsAppShareUrl).toContain('https://api.whatsapp.com/send');
    });
  });

  describe('VoteBankAnalyticsUseCase', () => {
    it('should aggregate constituency leaderboard and summary statistics', async () => {
      const result = await voteBankAnalyticsUseCase.execute();

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.summary.totalRegisteredMembers).toBe(70);
      expect(data.summary.totalConstituenciesCovered).toBe(2);
      expect(data.summary.ekthaYatraRegistrations).toBe(42);
      expect(data.constituencyLeaderboard.length).toBe(2);
      expect(data.constituencyLeaderboard[0].assemblyConstituency).toBe('Vemulawada');
      expect(data.constituencyLeaderboard[0].totalMembers).toBe(42);
      expect(data.constituencyLeaderboard[0].kulaBreakdown['Shilpi']).toBe(42);
      expect(data.confidentialNotice).toContain('STRICTLY CONFIDENTIAL');
    });
  });

  describe('AnnouncementsUseCase', () => {
    it('should create a community broadcast announcement', async () => {
      const result = await announcementsUseCase.create({
        authorPublicId: 'usr_admin_1',
        title: 'Ektha Yatra Grand Rally in Karimnagar',
        content: 'Join us at the town hall for artisan felicitations.',
        category: 'EKTHA_YATRA',
        priority: 'HIGH',
        targetDistrict: 'Karimnagar',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().title).toBe('Ektha Yatra Grand Rally in Karimnagar');
    });

    it('should list active announcements', async () => {
      const result = await announcementsUseCase.getActive('Karimnagar');

      expect(result.isSuccess).toBe(true);
      const list = result.getValue();
      expect(list.length).toBeGreaterThan(0);
      expect(list[0].category).toBe('EKTHA_YATRA');
    });
  });

  describe('SuspendMemberUseCase', () => {
    it('should soft-delete user and revoke sessions across pods', async () => {
      const result = await suspendMemberUseCase.execute({
        targetUserPublicId: 'usr_mem_456',
        adminPublicId: 'usr_admin_1',
        reason: 'Spam duplicate account identified',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().message).toContain('suspended and all active sessions revoked');
    });
  });
});
