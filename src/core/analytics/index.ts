// Analytics module - PostHog integration
export { AnalyticsProvider } from './AnalyticsProvider'
export { useAnalytics } from './useAnalytics'
export {
  initAnalytics,
  identifyUser,
  resetUser,
  trackEvent,
  trackPageView,
  setUserProperties,
  isFeatureEnabled,
  getFeatureFlag,
  reloadFeatureFlags,
  onFeatureFlagsLoaded,
} from './posthog'
export type { AnalyticsConfig } from './posthog'
