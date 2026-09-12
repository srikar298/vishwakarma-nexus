import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateContactUseCase } from './update-contact.use-case';
import { GetMemberProfileUseCase } from './get-member-profile.use-case';
import { SearchMembersUseCase } from './search-members.use-case';
import { CoordinatorResetMpinUseCase } from './coordinator-reset-mpin.use-case';

const sampleUserData = {
  id: 101,
  userId: 101,
  publicId: 'usr_mem_456',
  firstName: 'Suresh',
  lastName: 'Achary',
  role: 'MEMBER_BASIC',
  digitalId: 'VKC-2026-998877',
  phone: '+919123456780',
  identifier: '+919123456780',
  provider: 'PHONE',
  email: 'suresh@example.com',
  kula: 'Shilpi',
  trade: 'Temple Sthapathi',
  district: 'Karimnagar',
  mandal: 'Vemulawada',
  state: 'Telangana',
  source: 'ORGANIC',
  isVerified: false,
  isPaid: false,
  photoUrl: null,
  intents: { shastraVaults: true, matrimony: false },
  joinedAt: new Date('2026-09-01'),
};

const sampleSearchResult = {
  userPublicId: 'usr_mem_456',
  firstName: 'Suresh',
  lastName: 'Achary',
  digitalId: 'VKC-2026-998877',
  phone: '+919123456780',
  kula: 'Shilpi',
  trade: 'Temple Sthapathi',
  district: 'Karimnagar',
  mandal: 'Vemulawada',
  source: 'ORGANIC',
  isVerified: false,
  joinedAt: new Date('2026-09-01'),
};

let queryCounter = 0;
let isUpdatePhoneTest = false;
let forceEmptyQuery = false;

// Mock DB for Members tests
vi.mock('@vishwakarma-k-c/db', () => {
  const mockTx = {
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue([]),
    }),
  };

  return {
    db: {
      transaction: vi.fn((callback) => callback(mockTx)),
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            limit: vi.fn().mockImplementation(() => {
              if (forceEmptyQuery) {
                return Promise.resolve([]);
              }
              queryCounter++;
              // Third query in update phone is duplicate identity check -> return []
              if (isUpdatePhoneTest && queryCounter === 3) {
                return Promise.resolve([]);
              }
              return Promise.resolve([sampleUserData]);
            }),
          })),
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  offset: vi.fn().mockResolvedValue([sampleSearchResult]),
                }),
              }),
            }),
          }),
        })),
      })),
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
      delete: vi.fn().mockResolvedValue(undefined),
    },
    HashingService: {
      hashCredential: vi.fn().mockReturnValue('salt999:hash999'),
    },
  };
});

describe('Members Module: Contact Management & Search Flows', () => {
  let updateContactUseCase: UpdateContactUseCase;
  let getMemberProfileUseCase: GetMemberProfileUseCase;
  let searchMembersUseCase: SearchMembersUseCase;
  let coordinatorResetMpinUseCase: CoordinatorResetMpinUseCase;

  beforeEach(() => {
    queryCounter = 0;
    isUpdatePhoneTest = false;
    forceEmptyQuery = false;
    updateContactUseCase = new UpdateContactUseCase();
    getMemberProfileUseCase = new GetMemberProfileUseCase();
    searchMembersUseCase = new SearchMembersUseCase();
    coordinatorResetMpinUseCase = new CoordinatorResetMpinUseCase();
  });

  describe('UpdateContactUseCase (Editable Phone & Optional Email)', () => {
    it('should update mobile number and reset isVerified to false', async () => {
      isUpdatePhoneTest = true;
      const result = await updateContactUseCase.execute({
        userPublicId: 'usr_mem_456',
        phone: '9848011223',
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.phone).toBe('+919848011223');
      expect(data.isVerified).toBe(false);
    });

    it('should update optional email', async () => {
      const result = await updateContactUseCase.execute({
        userPublicId: 'usr_mem_456',
        email: 'newemail@example.com',
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.email).toBe('newemail@example.com');
    });

    it('should reject update if neither phone nor email is supplied', async () => {
      const result = await updateContactUseCase.execute({
        userPublicId: 'usr_mem_456',
      });

      expect(result.isFailure).toBe(true);
      expect((result.getError() as any).code).toBe('NO_CHANGES');
    });
  });

  describe('GetMemberProfileUseCase', () => {
    it('should fetch complete member profile with Digital ID and Shastra Vaults intent', async () => {
      const result = await getMemberProfileUseCase.execute('usr_mem_456');

      expect(result.isSuccess).toBe(true);
      const profileData = result.getValue();
      expect(profileData.user.publicId).toBe('usr_mem_456');
      expect(profileData.profile.digitalId).toBe('VKC-2026-998877');
      expect(profileData.profile.trade).toBe('Temple Sthapathi');
      expect(profileData.profile.intents?.shastraVaults).toBe(true);
    });
  });

  describe('SearchMembersUseCase', () => {
    it('should search members by query and return matching items', async () => {
      const result = await searchMembersUseCase.execute({
        query: 'Suresh',
        district: 'Karimnagar',
      });

      expect(result.isSuccess).toBe(true);
      const searchData = result.getValue();
      expect(searchData.items).toHaveLength(1);
      expect(searchData.items[0].fullName).toBe('Suresh Achary');
      expect(searchData.items[0].digitalId).toBe('VKC-2026-998877');
    });
  });

  describe('CoordinatorResetMpinUseCase (Helpdesk On-Ground Reset)', () => {
    it('should reset member MPIN by coordinator with reason and audit log', async () => {
      const result = await coordinatorResetMpinUseCase.execute({
        targetUserPublicId: 'usr_mem_456',
        coordinatorPublicId: 'usr_coord_001',
        newMpin: '9876',
        reason: 'Ektha Yatra Helpdesk Verification via Physical ID',
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.targetUserPublicId).toBe('usr_mem_456');
      expect(data.digitalId).toBe('VKC-2026-998877');
      expect(data.message).toContain('successfully reset by coordinator');
    });

    it('should return error when target member is not found', async () => {
      forceEmptyQuery = true;
      const result = await coordinatorResetMpinUseCase.execute({
        targetUserPublicId: 'non_existent_user',
        coordinatorPublicId: 'usr_coord_001',
        newMpin: '9876',
        reason: 'Lost MPIN',
      });

      expect(result.isFailure).toBe(true);
      expect((result.getError() as any).code).toBe('USER_NOT_FOUND');
    });
  });
});
