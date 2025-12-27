export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  context?: string;
}

export class Logger {
  private static logs: LogEntry[] = [];
  private static maxLogs = 1000;
  private static enableConsole = true;
  private static enableStorage = false;

  static configure(options: {
    maxLogs?: number;
    enableConsole?: boolean;
    enableStorage?: boolean;
  }): void {
    if (options.maxLogs !== undefined) this.maxLogs = options.maxLogs;
    if (options.enableConsole !== undefined) this.enableConsole = options.enableConsole;
    if (options.enableStorage !== undefined) this.enableStorage = options.enableStorage;
  }

  private static addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (this.enableStorage && typeof window !== 'undefined') {
      try {
        const storedLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
        storedLogs.push(entry);
        if (storedLogs.length > this.maxLogs) {
          storedLogs.shift();
        }
        localStorage.setItem('app_logs', JSON.stringify(storedLogs));
      } catch (error) {
        console.error('Failed to store log:', error);
      }
    }
  }

  static debug(message: string, data?: any, context?: string): void {
    const entry: LogEntry = {
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date(),
      data,
      context,
    };

    this.addLog(entry);

    if (this.enableConsole) {
      console.debug(
        `[${entry.timestamp.toISOString()}] [DEBUG]${context ? ` [${context}]` : ''}: ${message}`,
        data || ''
      );
    }
  }

  static info(message: string, data?: any, context?: string): void {
    const entry: LogEntry = {
      level: LogLevel.INFO,
      message,
      timestamp: new Date(),
      data,
      context,
    };

    this.addLog(entry);

    if (this.enableConsole) {
      console.info(
        `[${entry.timestamp.toISOString()}] [INFO]${context ? ` [${context}]` : ''}: ${message}`,
        data || ''
      );
    }
  }

  static warn(message: string, data?: any, context?: string): void {
    const entry: LogEntry = {
      level: LogLevel.WARN,
      message,
      timestamp: new Date(),
      data,
      context,
    };

    this.addLog(entry);

    if (this.enableConsole) {
      console.warn(
        `[${entry.timestamp.toISOString()}] [WARN]${context ? ` [${context}]` : ''}: ${message}`,
        data || ''
      );
    }
  }

  static error(message: string, error?: any, context?: string): void {
    const entry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      timestamp: new Date(),
      data: error,
      context,
    };

    this.addLog(entry);

    if (this.enableConsole) {
      console.error(
        `[${entry.timestamp.toISOString()}] [ERROR]${context ? ` [${context}]` : ''}: ${message}`,
        error || ''
      );
    }
  }

  static getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app_logs');
    }
  }

  static downloadLogs(): void {
    if (typeof window === 'undefined') return;

    const logsJson = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// API Request Logger
export class APILogger {
  static logRequest(method: string, url: string, data?: any): void {
    Logger.info(`API Request: ${method} ${url}`, data, 'API');
  }

  static logResponse(method: string, url: string, status: number, data?: any): void {
    Logger.info(`API Response: ${method} ${url} - ${status}`, data, 'API');
  }

  static logError(method: string, url: string, error: any): void {
    Logger.error(`API Error: ${method} ${url}`, error, 'API');
  }
}
