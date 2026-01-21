import type { ReactNode } from 'react'

import { useFeatureFlag } from './useFeatureFlag'

import type { FeatureFlagKey } from './types'

interface FeatureFlagProps {
  /**
   * The feature flag key to check
   */
  flag: FeatureFlagKey
  /**
   * Content to render when the flag is enabled
   */
  children: ReactNode
  /**
   * Optional fallback content when the flag is disabled
   */
  fallback?: ReactNode
}

/**
 * Component for conditional rendering based on feature flags
 *
 * @example
 * ```tsx
 * <FeatureFlag flag="new-dashboard" fallback={<OldDashboard />}>
 *   <NewDashboard />
 * </FeatureFlag>
 * ```
 */
export function FeatureFlag({
  flag,
  children,
  fallback = null,
}: FeatureFlagProps) {
  const isEnabled = useFeatureFlag(flag)

  if (isEnabled) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

interface FeatureFlagOffProps {
  /**
   * The feature flag key to check
   */
  flag: FeatureFlagKey
  /**
   * Content to render when the flag is disabled
   */
  children: ReactNode
}

/**
 * Component for rendering content only when a feature flag is OFF
 * Useful for deprecation notices or maintenance messages
 *
 * @example
 * ```tsx
 * <FeatureFlagOff flag="maintenance-mode">
 *   <MainContent />
 * </FeatureFlagOff>
 * ```
 */
export function FeatureFlagOff({ flag, children }: FeatureFlagOffProps) {
  const isEnabled = useFeatureFlag(flag)

  if (!isEnabled) {
    return <>{children}</>
  }

  return null
}
