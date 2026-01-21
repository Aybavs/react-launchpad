import posthog from 'posthog-js'

export interface AnalyticsConfig {
  apiKey: string
  apiHost?: string
  enabled?: boolean
  debug?: boolean
}

let isInitialized = false

/**
 * Initialize PostHog analytics
 * Call this once at app startup
 */
export function initAnalytics(config: AnalyticsConfig): void {
  if (isInitialized) return
  if (!config.enabled) return
  if (!config.apiKey) {
    console.warn('[Analytics] API key not provided, analytics disabled')
    return
  }

  posthog.init(config.apiKey, {
    api_host: config.apiHost || 'https://app.posthog.com',
    loaded: (posthog) => {
      if (config.debug) {
        posthog.debug()
      }
    },
    capture_pageview: false, // We'll handle this manually for SPA
    capture_pageleave: true,
    persistence: 'localStorage',
    autocapture: true,
    disable_session_recording: import.meta.env.DEV,
  })

  isInitialized = true
}

/**
 * Identify a user for analytics tracking
 */
export function identifyUser(
  userId: string,
  properties?: Record<string, unknown>
): void {
  if (!isInitialized) return
  posthog.identify(userId, properties)
}

/**
 * Reset user identity (call on logout)
 */
export function resetUser(): void {
  if (!isInitialized) return
  posthog.reset()
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (!isInitialized) return
  posthog.capture(eventName, properties)
}

/**
 * Track a page view (for SPA navigation)
 */
export function trackPageView(path?: string): void {
  if (!isInitialized) return
  posthog.capture('$pageview', {
    $current_url: path || window.location.href,
  })
}

/**
 * Set user properties without identifying
 */
export function setUserProperties(properties: Record<string, unknown>): void {
  if (!isInitialized) return
  posthog.people.set(properties)
}

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flagKey: string): boolean {
  if (!isInitialized) return false
  return posthog.isFeatureEnabled(flagKey) ?? false
}

/**
 * Get feature flag value (for multivariate flags)
 */
export function getFeatureFlag(flagKey: string): string | boolean | undefined {
  if (!isInitialized) return undefined
  return posthog.getFeatureFlag(flagKey)
}

/**
 * Reload feature flags from server
 */
export function reloadFeatureFlags(): void {
  if (!isInitialized) return
  posthog.reloadFeatureFlags()
}

/**
 * Register callback for feature flag changes
 */
export function onFeatureFlagsLoaded(callback: () => void): void {
  if (!isInitialized) return
  posthog.onFeatureFlags(callback)
}

// Export posthog instance for advanced use cases
export { posthog }
