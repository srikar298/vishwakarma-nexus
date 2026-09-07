import { config } from '../config';

export interface ILogger {
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  debug(...args: any[]): void;
  trace(...args: any[]): void;
  fatal(...args: any[]): void;
  child(bindings?: Record<string, any>): ILogger;
}

const noopLogger: ILogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
  trace: () => {},
  fatal: () => {},
  child: () => noopLogger,
};

let _pinoInstance: any = null;

function getUnderlyingLogger(): ILogger {
  if (process.env.NODE_ENV === 'test') {
    return noopLogger;
  }

  if (!_pinoInstance) {
    try {
      // Lazy require/import to prevent test runner bundling collisions
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
      _pinoInstance = noopLogger;
    }
  }

  return _pinoInstance;
}

export const logger: ILogger = {
  info: (...args: any[]) => getUnderlyingLogger().info(...args),
  warn: (...args: any[]) => getUnderlyingLogger().warn(...args),
  error: (...args: any[]) => getUnderlyingLogger().error(...args),
  debug: (...args: any[]) => getUnderlyingLogger().debug(...args),
  trace: (...args: any[]) => getUnderlyingLogger().trace(...args),
  fatal: (...args: any[]) => getUnderlyingLogger().fatal(...args),
  child: (bindings?: Record<string, any>) => getUnderlyingLogger().child(bindings),
};
