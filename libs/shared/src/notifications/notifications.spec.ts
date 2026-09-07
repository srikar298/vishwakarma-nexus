import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  NotificationDispatcher,
  NotificationPayload,
  TemplateEngine,
  BaseNotificationChannel,
  INotificationAdapter,
  NotificationChannelType,
  AdapterResult,
  NotificationPriority,
} from './index';
import { InMemoryJobQueue } from '../queue/memory-job-queue';

// Mock MockAdapter Helper
class MockVendorAdapter implements INotificationAdapter {
  constructor(
    public readonly name: string,
    public readonly channelType: NotificationChannelType,
    private shouldFail: boolean = false,
    private errorMsg: string = 'Provider Outage'
  ) {}

  public isAvailable(): boolean {
    return true;
  }

  public async send(payload: NotificationPayload): Promise<AdapterResult> {
    if (this.shouldFail) {
      return {
        success: false,
        error: this.errorMsg,
        statusCode: 500,
      };
    }

    return {
      success: true,
      messageId: `mock_${this.name}_${Date.now()}`,
      statusCode: 200,
    };
  }
}

class TestMockChannel extends BaseNotificationChannel {
  constructor(public readonly channelType: NotificationChannelType) {
    super();
  }
}

describe('Component 8: Multi-Channel Notification Engine (Chain of Responsibility)', () => {
  let dispatcher: NotificationDispatcher;
  let jobQueue: InMemoryJobQueue;

  beforeEach(() => {
    jobQueue = new InMemoryJobQueue();
    dispatcher = new NotificationDispatcher(jobQueue);
  });

  describe('TemplateEngine', () => {
    it('should interpolate template parameters correctly', () => {
      const template = 'Namaste {{name}}, your VKC verification code is {{otp}}. Valid for {{mins}} mins.';
      const rendered = TemplateEngine.render(template, {
        name: 'Suresh Kumar',
        otp: 948210,
        mins: 10,
      });

      expect(rendered).toBe('Namaste Suresh Kumar, your VKC verification code is 948210. Valid for 10 mins.');
    });

    it('should handle missing parameters gracefully or throw when configured', () => {
      const template = 'Hello {{name}}, order #{{orderId}}';
      const renderedDefault = TemplateEngine.render(template, { name: 'Ramesh' });
      expect(renderedDefault).toBe('Hello Ramesh, order #');

      expect(() => {
        TemplateEngine.render(template, { name: 'Ramesh' }, { throwOnMissing: true });
      }).toThrowError(/Missing required template parameters: orderId/);
    });

    it('should extract all declared parameters from a template', () => {
      const template = '{{greeting}} {{name}}, your balance is {{currency}}{{amount}}';
      const tokens = TemplateEngine.extractParameters(template);
      expect(tokens).toEqual(['greeting', 'name', 'currency', 'amount']);
    });
  });

  describe('Intra-Channel Chain of Responsibility (Multi-Adapter)', () => {
    it('should fall through to Adapter 2 if Adapter 1 fails within the same channel', async () => {
      const customWhatsApp = new TestMockChannel('WHATSAPP');
      
      // Adapter 1 fails, Adapter 2 succeeds
      customWhatsApp.registerAdapter(new MockVendorAdapter('GupshupFailed', 'WHATSAPP', true, 'Gupshup 503 Service Unavailable'));
      customWhatsApp.registerAdapter(new MockVendorAdapter('MetaCloudSuccess', 'WHATSAPP', false));

      dispatcher.registerChannel(customWhatsApp);

      const result = await dispatcher.sendWithCascade(['WHATSAPP'], {
        recipient: '+919876543210',
        message: 'Your verification OTP is 123456',
      });

      expect(result.success).toBe(true);
      expect(result.channel).toBe('WHATSAPP');
      expect(result.adapterName).toBe('MetaCloudSuccess');
      expect(result.adaptersAttempted).toEqual(['GupshupFailed', 'MetaCloudSuccess']);
      expect(result.channelsAttempted).toEqual(['WHATSAPP']);
    });

    it('should fail channel delivery only when ALL adapters in that channel fail', async () => {
      const customSms = new TestMockChannel('SMS');
      customSms.registerAdapter(new MockVendorAdapter('Msg91Down', 'SMS', true, 'Msg91 DLT Gateway Error'));
      customSms.registerAdapter(new MockVendorAdapter('TwilioDown', 'SMS', true, 'Twilio Account Suspended'));

      dispatcher.registerChannel(customSms);

      const result = await dispatcher.sendWithCascade(['SMS'], {
        recipient: '+919876543210',
        message: 'Alert message',
      });

      expect(result.success).toBe(false);
      expect(result.channel).toBe('SMS');
      expect(result.adaptersAttempted).toEqual(['Msg91Down', 'TwilioDown']);
      expect(result.error).toContain('All adapters failed');
    });
  });

  describe('Inter-Channel Cascading Fallback', () => {
    it('should cascade from WhatsApp to SMS when all WhatsApp adapters fail', async () => {
      // 1. WhatsApp Channel where all adapters fail
      const failingWhatsApp = new TestMockChannel('WHATSAPP');
      failingWhatsApp.registerAdapter(new MockVendorAdapter('WA_Adapter1_Fail', 'WHATSAPP', true));
      failingWhatsApp.registerAdapter(new MockVendorAdapter('WA_Adapter2_Fail', 'WHATSAPP', true));

      // 2. SMS Channel where second adapter succeeds
      const recoveringSms = new TestMockChannel('SMS');
      recoveringSms.registerAdapter(new MockVendorAdapter('SMS_Adapter1_Fail', 'SMS', true));
      recoveringSms.registerAdapter(new MockVendorAdapter('SMS_Adapter2_Pass', 'SMS', false));

      dispatcher.registerChannel(failingWhatsApp);
      dispatcher.registerChannel(recoveringSms);

      const result = await dispatcher.sendWithCascade(['WHATSAPP', 'SMS', 'EMAIL'], {
        recipient: '+919876543210',
        message: 'Welcome to VKC Platform',
      });

      expect(result.success).toBe(true);
      expect(result.channel).toBe('SMS');
      expect(result.adapterName).toBe('SMS_Adapter2_Pass');
      expect(result.channelsAttempted).toEqual(['WHATSAPP', 'SMS']);
      expect(result.adaptersAttempted).toEqual([
        'WA_Adapter1_Fail',
        'WA_Adapter2_Fail',
        'SMS_Adapter1_Fail',
        'SMS_Adapter2_Pass',
      ]);
    });

    it('should report comprehensive exhaustion error if all channels and all adapters fail', async () => {
      const failingWhatsApp = new TestMockChannel('WHATSAPP');
      failingWhatsApp.registerAdapter(new MockVendorAdapter('WA1', 'WHATSAPP', true));

      const failingSms = new TestMockChannel('SMS');
      failingSms.registerAdapter(new MockVendorAdapter('SMS1', 'SMS', true));

      dispatcher.registerChannel(failingWhatsApp);
      dispatcher.registerChannel(failingSms);

      const result = await dispatcher.sendWithCascade(['WHATSAPP', 'SMS'], {
        recipient: '+919876543210',
        message: 'Critical broadcast',
      });

      expect(result.success).toBe(false);
      expect(result.channelsAttempted).toEqual(['WHATSAPP', 'SMS']);
      expect(result.adaptersAttempted).toEqual(['WA1', 'SMS1']);
      expect(result.error).toContain('Notification delivery exhausted across all channels');
    });
  });

  describe('Anti-Spam Rate Limiting & Async Queue Offloading', () => {
    it('should block spam flooding to the same recipient when rate limit is exceeded', async () => {
      const recipient = '+919999988888';

      // Send 10 messages (rate limit capacity = 10)
      for (let i = 0; i < 10; i++) {
        const res = await dispatcher.sendWithCascade(['SMS'], {
          recipient,
          message: `OTP Attempt ${i}`,
        });
        expect(res.success).toBe(true);
      }

      // 11th message must be blocked by Token Bucket Limiter
      const blockedRes = await dispatcher.sendWithCascade(['SMS'], {
        recipient,
        message: 'OTP Attempt 11 - Spammed',
      });

      expect(blockedRes.success).toBe(false);
      expect(blockedRes.error).toContain('Anti-spam rate limit exceeded');
    });

    it('should asynchronously offload notification dispatch to JobQueue when async is true', async () => {
      const result = await dispatcher.sendWithCascade(
        ['WHATSAPP', 'SMS'],
        {
          recipient: '+919876543210',
          message: 'Async receipt {{id}}',
          templateParams: { id: 'TXN-101' },
        },
        { async: true, priority: NotificationPriority.URGENT }
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.adaptersAttempted).toEqual(['JobQueue']);
    });
  });
});
