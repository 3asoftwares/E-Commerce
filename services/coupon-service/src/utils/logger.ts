/**
 * Simple Logger utility for coupon-service
 * Replaces the @3asoftwares/utils/server Logger
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enableConsole?: boolean;
  enableFile?: boolean;
  logFilePath?: string;
  logLevel?: string;
}

class LoggerClass {
  private config: LoggerConfig = {
    enableConsole: true,
    enableFile: false,
    logLevel: 'debug',
  };

  configure(config: LoggerConfig): void {
    this.config = { ...this.config, ...config };
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    meta?: Record<string, any>,
    context?: string
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}${metaStr}`;
  }

  private log(
    level: LogLevel,
    message: string,
    meta?: Record<string, any>,
    context?: string
  ): void {
    if (!this.config.enableConsole) return;

    const formattedMessage = this.formatMessage(level, message, meta, context);

    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }

  debug(message: string, meta?: Record<string, any>, context?: string): void {
    this.log('debug', message, meta, context);
  }

  info(message: string, meta?: Record<string, any>, context?: string): void {
    this.log('info', message, meta, context);
  }

  warn(message: string, meta?: Record<string, any>, context?: string): void {
    this.log('warn', message, meta, context);
  }

  error(message: string, meta?: Record<string, any>, context?: string): void {
    this.log('error', message, meta, context);
  }
}

export const Logger = new LoggerClass();
