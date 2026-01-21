import { useCallback } from 'react'

import { useLocation } from 'react-router'

import {
  trackEvent,
  trackPageView,
  identifyUser,
  resetUser,
  setUserProperties,
  isFeatureEnabled,
  getFeatureFlag,
} from './posthog'

/**
 * React hook for analytics tracking
 * Provides convenient methods for common analytics operations
 */
export function useAnalytics() {
  const location = useLocation()

  const track = useCallback(
    (eventName: string, properties?: Record<string, unknown>) => {
      trackEvent(eventName, {
        ...properties,
        path: location.pathname,
      })
    },
    [location.pathname]
  )

  const pageView = useCallback(() => {
    trackPageView(window.location.href)
  }, [])

  const identify = useCallback(
    (userId: string, properties?: Record<string, unknown>) => {
      identifyUser(userId, properties)
    },
    []
  )

  const reset = useCallback(() => {
    resetUser()
  }, [])

  const setProperties = useCallback((properties: Record<string, unknown>) => {
    setUserProperties(properties)
  }, [])

  const checkFeature = useCallback((flagKey: string) => {
    return isFeatureEnabled(flagKey)
  }, [])

  const getFeature = useCallback((flagKey: string) => {
    return getFeatureFlag(flagKey)
  }, [])

  return {
    track,
    pageView,
    identify,
    reset,
    setProperties,
    checkFeature,
    getFeature,
  }
}
