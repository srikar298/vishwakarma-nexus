import { 
  withCircuitBreaker, 
  retryWithBackoff, 
  IDistributedLockProvider, 
  defaultLockProvider, 
  IEventBus, 
  defaultEventBus,
  IAuditLogger,
  auditLogger,
  logger,
  DomainEvent
} from '@vishwakarma-k-c/shared';

export interface ProcessPaymentInput {
  userId: string;
  transactionId: string;
  amountInPaise: number;
  currency: string;
  purpose: 'membership_verification' | 'matrimony_subscription' | 'donation';
}

export interface PaymentResult {
  transactionId: string;
  status: 'captured' | 'failed';
  gatewayReferenceId?: string;
  capturedAt: Date;
}

/**
 * Low-Level Design (LLD): Finance Service
 * Implements high-concurrency payment processing with Distributed Locking,
 * Circuit Breaker protection against gateway outages, and Domain Event publishing.
 */
export class FinanceService {
  constructor(
    private lockProvider: IDistributedLockProvider = defaultLockProvider,
    private eventBus: IEventBus = defaultEventBus,
    private audit: IAuditLogger = auditLogger
  ) {}

  public async processPayment(input: ProcessPaymentInput): Promise<PaymentResult> {
    const lockKey = `lock:finance:txn:${input.transactionId}`;

    // 1. Concurrency Guard: Mutex Lock prevents double-charge / race conditions
    return this.lockProvider.withLock(lockKey, async () => {
      logger.info({ msg: 'Processing payment transaction', transactionId: input.transactionId });

      // 2. Resilience: Call external payment gateway through Circuit Breaker + Retry
      const gatewayResponse = await withCircuitBreaker(
        'payment-gateway',
        async () => {
          return retryWithBackoff(
            async () => {
              // Simulated Payment Gateway Adapter Call (e.g. Razorpay/Stripe)
              return {
                gatewayRef: `gw_${Date.now()}`,
                status: 'captured' as const,
              };
            },
            { maxRetries: 2, initialDelayMs: 300 }
          );
        },
        { failureRateThreshold: 50, minimumNumberOfCalls: 5, resetTimeoutMs: 30000 }
      );

      const capturedAt = new Date();
      const result: PaymentResult = {
        transactionId: input.transactionId,
        status: gatewayResponse.status,
        gatewayReferenceId: gatewayResponse.gatewayRef,
        capturedAt,
      };

      // 3. Audit Trail for Financial Compliance
      await this.audit.log({
        action: 'PAYMENT_CAPTURED',
        resourceType: 'FINANCE_TRANSACTION',
        targetId: input.transactionId,
        userId: input.userId,
        severity: 'INFO',
        metadata: {
          amount: input.amountInPaise,
          currency: input.currency,
          purpose: input.purpose,
        },
      });

      // 4. Publish Domain Event for downstream modules (e.g. Members Verification, Invoicing)
      const event: DomainEvent<{ transactionId: string; userId: string; purpose: string; amount: number }> = {
        id: `evt_${Date.now()}`,
        eventName: 'finance.payment.captured',
        aggregateId: input.transactionId,
        occurredOn: capturedAt,
        payload: {
          transactionId: input.transactionId,
          userId: input.userId,
          purpose: input.purpose,
          amount: input.amountInPaise,
        },
      };

      await this.eventBus.publish(event);

      return result;
    }, { ttlMs: 10000 });
  }
}
