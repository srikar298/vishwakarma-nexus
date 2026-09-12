import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUseCase } from './register.use-case';
import { LoginUseCase } from './login.use-case';
import { ResetMpinChallengeUseCase } from './reset-mpin-challenge.use-case';
import { cacheProvider } from '@vishwakarma-k-c/shared';

// Mock DB
vi.mock('@vishwakarma-k-c/db', () => {
  const mockTx = {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: 101,
            publicId: 'usr_test_123',
            firstName: 'Ramesh',
            lastName: 'Chary',
            role: 'MEMBER_BASIC',
            digitalId: 'VKC-2026-104820',
            phone: '+919876543210',
            email: 'ramesh@example.com',
            kula: 'Vishvajna',
            trade: 'Goldsmith',
            district: 'Warangal',
            mandal: 'Hanamkonda',
            source: 'EKTHA_YATRA',
          },
        ]),
      }),
    }),
  };

  return {
    db: {
      transaction: vi.fn((callback) => callback(mockTx)),
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 101,
                userId: 101,
                publicId: 'usr_test_123',
                firstName: 'Ramesh',
                lastName: 'Chary',
                role: 'MEMBER_BASIC',
                digitalId: 'VKC-2026-104820',
                identifier: '+919876543210',
                phone: '+919876543210',
                email: 'ramesh@example.com',
                kula: 'Vishvajna',
                trade: 'Goldsmith',
                district: 'Warangal',
                mandal: 'Hanamkonda',
                source: 'EKTHA_YATRA',
                credentialHash: 'salt123:hash123',
              },
            ]),
          }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      }),
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      }),
    },
    DrizzleOutboxStore: class {
      save = vi.fn().mockResolvedValue(undefined);
    },
  };
});

vi.mock('@vishwakarma-k-c/shared', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    defaultLockProvider: {
      withLock: vi.fn(async (_key, callback) => callback()),
    },
    auditLogger: {
      log: vi.fn().mockResolvedValue({}),
    },
    HashingService: {
      ...actual.HashingService,
      hashCredential: vi.fn().mockReturnValue('salt123:hash123'),
      verifyCredential: vi.fn((pin: string) => pin === '1234'),
    },
    JWTService: {
      signAccessToken: vi.fn().mockResolvedValue('mock-access-token'),
      signRefreshToken: vi.fn().mockResolvedValue('mock-refresh-token'),
      verifyToken: vi.fn().mockResolvedValue({ id: 'usr_test_123', type: 'refresh', jti: 'jti-123' }),
    },
    cacheProvider: {
      addToSet: vi.fn().mockResolvedValue(undefined),
      expire: vi.fn().mockResolvedValue(undefined),
      getSet: vi.fn().mockResolvedValue(['jti-123']),
      removeFromSet: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue(undefined),
    },
  };
});

describe('Core General Registration & Login Flow', () => {
  let mockAuthRepo: any;
  let registerUseCase: RegisterUseCase;
  let loginUseCase: LoginUseCase;
  let resetMpinChallengeUseCase: ResetMpinChallengeUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthRepo = {
      findByIdentifier: vi.fn().mockResolvedValue(null),
      findByPublicId: vi.fn().mockResolvedValue({
        id: 101,
        publicId: 'usr_test_123',
        role: 'MEMBER_BASIC',
      }),
    };

    registerUseCase = new RegisterUseCase(mockAuthRepo);
    loginUseCase = new LoginUseCase(mockAuthRepo);
    resetMpinChallengeUseCase = new ResetMpinChallengeUseCase(mockAuthRepo);
  });

  describe('RegisterUseCase', () => {
    it('should register a new member with Digital ID and multi-select interests including Shastra Vaults', async () => {
      const result = await registerUseCase.execute({
        firstName: 'Ramesh',
        lastName: 'Chary',
        phone: '9876543210',
        email: 'ramesh@example.com',
        kula: 'Vishvajna',
        trade: 'Goldsmith',
        district: 'Warangal',
        mandal: 'Hanamkonda',
        mpin: '1234',
        source: 'EKTHA_YATRA',
        interests: ['SHASTRA_VAULTS', 'MATRIMONY', 'BUSINESS_LEADS'],
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.user.firstName).toBe('Ramesh');
      expect(data.digitalId).toMatch(/^VKC-\d{4}-\d{6}$/);
      expect(data.tokens.accessToken).toBe('mock-access-token');
      expect(data.tokens.refreshToken).toBe('mock-refresh-token');
    });

    it('should reject registration if mobile number is already registered', async () => {
      mockAuthRepo.findByIdentifier.mockResolvedValueOnce({
        id: 1,
        identifier: '+919876543210',
      });

      const result = await registerUseCase.execute({
        firstName: 'Ramesh',
        lastName: 'Chary',
        phone: '9876543210',
        kula: 'Vishvajna',
        trade: 'Goldsmith',
        district: 'Warangal',
        mpin: '1234',
      });

      expect(result.isFailure).toBe(true);
      expect((result.getError() as any).code).toBe('PHONE_ALREADY_REGISTERED');
    });

    it('should reject invalid mobile number format', async () => {
      const result = await registerUseCase.execute({
        firstName: 'Ramesh',
        lastName: 'Chary',
        phone: '123', // invalid length
        kula: 'Vishvajna',
        trade: 'Goldsmith',
        district: 'Warangal',
        mpin: '1234',
      });

      expect(result.isFailure).toBe(true);
      expect((result.getError() as any).code).toBe('INVALID_PHONE');
    });
  });

  describe('LoginUseCase', () => {
    it('should log in successfully with phone number and valid MPIN', async () => {
      const result = await loginUseCase.execute({
        identifier: '9876543210',
        mpin: '1234',
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.user.publicId).toBe('usr_test_123');
      expect(data.tokens.accessToken).toBe('mock-access-token');
    });

    it('should log in successfully with Digital ID and valid MPIN (typo-resilient backup)', async () => {
      const result = await loginUseCase.execute({
        identifier: 'VKC-2026-104820',
        mpin: '1234',
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.profile.digitalId).toBe('VKC-2026-104820');
      expect(data.tokens.accessToken).toBe('mock-access-token');
    });

    it('should reject login when MPIN is incorrect', async () => {
      const result = await loginUseCase.execute({
        identifier: '9876543210',
        mpin: '9999', // Incorrect MPIN
      });

      expect(result.isFailure).toBe(true);
      expect((result.getError() as any).code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject immediately if account is already locked out', async () => {
      vi.mocked(cacheProvider.get).mockResolvedValueOnce('LOCKED');

      const result = await loginUseCase.execute({
        identifier: '9876543210',
        mpin: '1234',
      });

      expect(result.isFailure).toBe(true);
      expect((result.getError() as any).code).toBe('ACCOUNT_LOCKED');
    });

    it('should lock account when 5 failed attempts are reached', async () => {
      // Simulate 4 previous failed attempts
      vi.mocked(cacheProvider.get).mockResolvedValueOnce(null); // not locked
      vi.mocked(cacheProvider.get).mockResolvedValueOnce(4); // 4 attempts exist

      const result = await loginUseCase.execute({
        identifier: '9876543210',
        mpin: '9999',
      });

      expect(result.isFailure).toBe(true);
      expect((result.getError() as any).code).toBe('TOO_MANY_ATTEMPTS');
      expect(cacheProvider.set).toHaveBeenCalledWith(
        'auth:lockout:+919876543210',
        'LOCKED',
        900
      );
    });
  });

  describe('ResetMpinChallengeUseCase (Demographic Challenge Self-Reset)', () => {
    it('should successfully reset MPIN when Kula and District match profile records', async () => {
      const result = await resetMpinChallengeUseCase.execute({
        identifier: '9876543210',
        kula: 'Vishvajna',
        district: 'Warangal',
        newMpin: '5678',
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.digitalId).toBe('VKC-2026-104820');
      expect(data.message).toContain('MPIN reset successfully');
    });

    it('should reject reset when demographic challenge (Kula or District) does not match', async () => {
      const result = await resetMpinChallengeUseCase.execute({
        identifier: '9876543210',
        kula: 'WrongKula',
        district: 'Warangal',
        newMpin: '5678',
      });

      expect(result.isFailure).toBe(true);
      expect((result.getError() as any).code).toBe('INVALID_DEMOGRAPHIC_CHALLENGE');
    });

    it('should lock account when demographic challenge fails 3 consecutive times', async () => {
      vi.mocked(cacheProvider.get).mockResolvedValueOnce(null); // not locked
      vi.mocked(cacheProvider.get).mockResolvedValueOnce(2); // 2 previous failed attempts

      const result = await resetMpinChallengeUseCase.execute({
        identifier: '9876543210',
        kula: 'WrongKula',
        district: 'WrongDistrict',
        newMpin: '5678',
      });

      expect(result.isFailure).toBe(true);
      expect((result.getError() as any).code).toBe('TOO_MANY_ATTEMPTS');
      expect(cacheProvider.set).toHaveBeenCalledWith(
        'auth:reset_challenge:lockout:+919876543210',
        'LOCKED',
        900
      );
    });
  });
});
