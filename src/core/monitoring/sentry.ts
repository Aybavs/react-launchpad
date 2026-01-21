import * as Sentry from '@sentry/react'

interface SentryConfig {
  dsn: string
  environment?: string
  release?: string
  tracesSampleRate?: number
  replaysSessionSampleRate?: number
  replaysOnErrorSampleRate?: number
}

/**
 * Initialize Sentry error tracking
 * Call this before rendering the app
 */
export function initSentry(config: SentryConfig) {
  if (!config.dsn) {
    console.warn('[Sentry] DSN not provided, error tracking disabled')
    return
  }

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment || import.meta.env.MODE,
    release: config.release || import.meta.env.VITE_APP_VERSION,

    // Performance monitoring
    tracesSampleRate: config.tracesSampleRate ?? 0.1,

    // Session replay (optional)
    replaysSessionSampleRate: config.replaysSessionSampleRate ?? 0.1,
    replaysOnErrorSampleRate: config.replaysOnErrorSampleRate ?? 1.0,

    // Filter out common noise
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      // Network errors
      'Network request failed',
      'Failed to fetch',
      'NetworkError',
      'AbortError',
      // User actions
      'User denied access',
    ],

    // Don't send events in development
    enabled: import.meta.env.PROD,

    beforeSend(event, _hint) {
      // Filter out events from browser extensions
      if (event.exception?.values?.[0]?.stacktrace?.frames) {
        const frames = event.exception.values[0].stacktrace.frames
        const hasExtensionFrame = frames.some(
          (frame) =>
            frame.filename?.includes('chrome-extension://') ||
            frame.filename?.includes('moz-extension://')
        )
        if (hasExtensionFrame) {
          return null
        }
      }

      // Add custom context
      event.tags = {
        ...event.tags,
        app_version: import.meta.env.VITE_APP_VERSION || 'unknown',
      }

      return event
    },
  })
}

/**
 * Sentry Error Boundary component
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary

/**
 * Manually capture an exception
 */
export function captureException(
  error: Error | unknown,
  context?: Record<string, unknown>
) {
  Sentry.captureException(error, {
    extra: context,
  })
}

/**
 * Manually capture a message
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, unknown>
) {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  })
}

/**
 * Set user context for error tracking
 */
export function setUser(
  user: { id: string; email?: string; username?: string } | null
) {
  Sentry.setUser(user)
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb)
}

/**
 * Create a custom Sentry span for performance tracking
 */
export function startSpan<T>(
  name: string,
  operation: string,
  callback: () => T
): T {
  return Sentry.startSpan({ name, op: operation }, callback)
}
