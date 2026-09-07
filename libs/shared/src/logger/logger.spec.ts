import { describe, it, expect, beforeEach } from 'vitest';
import { logger } from './index';

describe('Component 10.1: Logger Subsystem (Automatic PII Masking)', () => {
  beforeEach(() => {
    logger.clearCapturedLogs?.();
  });

  it('should automatically mask sensitive phone numbers, emails, and passwords in log data', () => {
    logger.info({
      msg: 'User login attempt',
      userId: 'user-101',
      password: 'mySecretPassword123',
      email: 'suresh.kumar@gmail.com',
      mobileNumber: '+919876543210',
      token: 'jwt.token.abc.123',
      safeData: 'public info',
    });

    const logs = logger.getCapturedLogs?.() || [];
    expect(logs.length).toBeGreaterThan(0);

    const loggedData = logs[logs.length - 1].data;
    expect(loggedData.userId).toBe('user-101');
    expect(loggedData.password).toBe('[REDACTED]');
    expect(loggedData.token).toBe('[REDACTED]');
    expect(loggedData.email).toContain('@gmail.com');
    expect(loggedData.email).not.toBe('suresh.kumar@gmail.com');
    expect(loggedData.mobileNumber).toContain('3210');
    expect(loggedData.safeData).toBe('public info');
  });

  it('should propagate and mask context in child loggers', () => {
    const childLogger = logger.child({
      correlationId: 'corr-999',
      userPhone: '+919999988888',
    });

    childLogger.info({ msg: 'Processing payment', orderId: 'ord_55' });

    const logs = logger.getCapturedLogs?.() || [];
    const loggedData = logs[logs.length - 1].data;

    expect(loggedData.correlationId).toBe('corr-999');
    expect(loggedData.orderId).toBe('ord_55');
    expect(loggedData.userPhone).toContain('8888');
    expect(loggedData.userPhone).not.toBe('+919999988888');
  });
});
