import { useEffect } from 'react'

import { useLocation } from 'react-router'

import { env } from '@/config/env'

import { initAnalytics, trackPageView } from './posthog'

interface AnalyticsProviderProps {
  children: React.ReactNode
}

/**
 * Analytics Provider Component
 * Initializes analytics and tracks page views on route changes
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const location = useLocation()

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics({
      apiKey: env.POSTHOG_KEY || '',
      apiHost: env.POSTHOG_HOST,
      enabled: env.ANALYTICS_ENABLED,
      debug: env.APP_ENV === 'development',
    })
  }, [])

  // Track page views on route changes
  useEffect(() => {
    trackPageView(window.location.href)
  }, [location.pathname])

  return <>{children}</>
}
