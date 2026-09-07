import { config } from '../config';
import { PiiMasker } from '../crypto/pii-masker';

export interface ILogger {
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  debug(...args: any[]): void;
  trace(...args: any[]): void;
  fatal(...args: any[]): void;
  child(bindings?: Record<string, any>): ILogger;
}

export interface CapturedLog {
  level: string;
  msg: string;
  data?: any;
  timestamp: string;
}

/**
 * Sanitizes all log arguments recursively through PiiMasker.
 */
function sanitizeLogArgs(args: any[]): any[] {
  return args.map((arg) => {
    if (arg === null || arg === undefined) return arg;
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'object') {
      return PiiMasker.sanitizeObject(arg);
    }
    return arg;
  });
}

/**
 * In-Memory Logger for Testing & Offline Execution with Log Capture
 */
export class TestLogger implements ILogger {
  public capturedLogs: CapturedLog[];
  private context: Record<string, any>;

  constructor(context: Record<string, any> = {}, sharedLogs?: CapturedLog[]) {
    this.context = context;
    this.capturedLogs = sharedLogs || [];
  }

  private record(level: string, args: any[]) {
    const sanitized = sanitizeLogArgs(args);
    let msg = '';
    let data: any = Object.keys(this.context).length > 0 ? { ...this.context } : undefined;

    for (const item of sanitized) {
      if (typeof item === 'string') {
        msg = msg ? `${msg} ${item}` : item;
      } else if (typeof item === 'object') {
        data = { ...(data || {}), ...item };
        if (item.msg && !msg) {
          msg = item.msg;
        }
      }
    }

    this.capturedLogs.push({
      level,
      msg,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  info(...args: any[]) { this.record('info', args); }
  warn(...args: any[]) { this.record('warn', args); }
  error(...args: any[]) { this.record('error', args); }
  debug(...args: any[]) { this.record('debug', args); }
  trace(...args: any[]) { this.record('trace', args); }
  fatal(...args: any[]) { this.record('fatal', args); }

  child(bindings?: Record<string, any>): ILogger {
    const childContext = { ...this.context, ...(bindings ? PiiMasker.sanitizeObject(bindings) : {}) };
    return new TestLogger(childContext, this.capturedLogs);
  }

  clear() {
    this.capturedLogs.length = 0;
  }
}

let _pinoInstance: any = null;
const _testLogger = new TestLogger();

function getUnderlyingLogger(): ILogger {
  if (process.env.NODE_ENV === 'test') {
    return _testLogger;
  }

  if (!_pinoInstance) {
    try {
      // Lazy require to prevent bundling collisions
      const pino = require('pino');
      _pinoInstance = pino({
        level: config.app.logLevel || 'info',
        ...(config.app.env !== 'production' && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          },
        }),
      });
    } catch {
      _pinoInstance = _testLogger;
    }
  }

  return _pinoInstance;
}

/**
 * Low-Level Design (LLD): Enterprise Structured Contextual Logger
 * Features:
 * - Automatic PII Masking Serializer on all payloads and child bindings
 * - Contextual correlation tracking (correlationId, requestId, userId)
 * - Safe Pino backend with Test capture fallbacks
 */
export const logger: ILogger & { getCapturedLogs?: () => CapturedLog[]; clearCapturedLogs?: () => void } = {
  info: (...args: any[]) => getUnderlyingLogger().info(...sanitizeLogArgs(args)),
  warn: (...args: any[]) => getUnderlyingLogger().warn(...sanitizeLogArgs(args)),
  error: (...args: any[]) => getUnderlyingLogger().error(...sanitizeLogArgs(args)),
  debug: (...args: any[]) => getUnderlyingLogger().debug(...sanitizeLogArgs(args)),
  trace: (...args: any[]) => getUnderlyingLogger().trace(...sanitizeLogArgs(args)),
  fatal: (...args: any[]) => getUnderlyingLogger().fatal(...sanitizeLogArgs(args)),
  child: (bindings?: Record<string, any>) => getUnderlyingLogger().child(bindings ? PiiMasker.sanitizeObject(bindings) : {}),
  getCapturedLogs: () => _testLogger.capturedLogs,
  clearCapturedLogs: () => _testLogger.clear(),
};
