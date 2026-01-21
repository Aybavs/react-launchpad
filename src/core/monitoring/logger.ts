import { captureException, captureMessage, addBreadcrumb } from './sentry'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: Error
}

interface LoggerConfig {
  minLevel: LogLevel
  enableConsole: boolean
  enableRemote: boolean
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const defaultConfig: LoggerConfig = {
  minLevel: import.meta.env.DEV ? 'debug' : 'info',
  enableConsole: true,
  enableRemote: import.meta.env.PROD,
}

class Logger {
  private config: LoggerConfig

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel]
  }

  private formatMessage(entry: LogEntry): string {
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : ''
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${contextStr}`
  }

  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }
  }

  private log(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return

    // Console output
    if (this.config.enableConsole) {
      const formatted = this.formatMessage(entry)
      switch (entry.level) {
        case 'debug':
          console.debug(formatted, entry.context || '')
          break
        case 'info':
          console.info(formatted, entry.context || '')
          break
        case 'warn':
          console.warn(formatted, entry.context || '')
          break
        case 'error':
          console.error(formatted, entry.error || entry.context || '')
          break
      }
    }

    // Remote logging via Sentry
    if (this.config.enableRemote) {
      // Add as breadcrumb for context
      addBreadcrumb({
        category: 'log',
        message: entry.message,
        level: entry.level === 'warn' ? 'warning' : entry.level,
        data: entry.context,
      })

      // Send errors and warnings to Sentry
      if (entry.level === 'error' && entry.error) {
        captureException(entry.error, entry.context)
      } else if (entry.level === 'error' || entry.level === 'warn') {
        captureMessage(
          entry.message,
          entry.level === 'warn' ? 'warning' : 'error',
          entry.context
        )
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log(this.createEntry('debug', message, context))
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log(this.createEntry('info', message, context))
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log(this.createEntry('warn', message, context))
  }

  error(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>
  ) {
    const err = error instanceof Error ? error : undefined
    const ctx =
      error instanceof Error ? context : { ...(error as object), ...context }
    this.log(this.createEntry('error', message, ctx, err))
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, unknown>): ChildLogger {
    return new ChildLogger(this, context)
  }
}

class ChildLogger {
  private parent: Logger
  private context: Record<string, unknown>

  constructor(parent: Logger, context: Record<string, unknown>) {
    this.parent = parent
    this.context = context
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.parent.debug(message, { ...this.context, ...context })
  }

  info(message: string, context?: Record<string, unknown>) {
    this.parent.info(message, { ...this.context, ...context })
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.parent.warn(message, { ...this.context, ...context })
  }

  error(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>
  ) {
    this.parent.error(message, error, { ...this.context, ...context })
  }
}

// Export singleton instance
export const logger = new Logger()
