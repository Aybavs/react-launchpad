import { useFeatureFlagStore } from './store'

import type { FeatureFlagKey } from './types'

/**
 * Hook to check if a feature flag is enabled
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isNewDashboard = useFeatureFlag('new-dashboard')
 *
 *   if (isNewDashboard) {
 *     return <NewDashboard />
 *   }
 *
 *   return <OldDashboard />
 * }
 * ```
 */
export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const isEnabled = useFeatureFlagStore((state) => state.isEnabled)
  return isEnabled(key)
}

/**
 * Hook to get a feature flag value (for multivariate flags)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const variant = useFeatureFlagValue<string>('experiment-variant')
 *
 *   switch (variant) {
 *     case 'A': return <VariantA />
 *     case 'B': return <VariantB />
 *     default: return <Control />
 *   }
 * }
 * ```
 */
export function useFeatureFlagValue<T extends boolean | string | number>(
  key: FeatureFlagKey
): T | undefined {
  const getValue = useFeatureFlagStore((state) => state.getValue)
  return getValue<T>(key)
}

/**
 * Hook to manage feature flag overrides (for development/testing)
 *
 * @example
 * ```tsx
 * function FeatureFlagPanel() {
 *   const { setOverride, clearOverrides, overrides } = useFeatureFlagOverrides()
 *
 *   return (
 *     <div>
 *       <button onClick={() => setOverride('new-dashboard', true)}>
 *         Enable New Dashboard
 *       </button>
 *       <button onClick={clearOverrides}>Clear Overrides</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFeatureFlagOverrides() {
  const setOverride = useFeatureFlagStore((state) => state.setOverride)
  const clearOverrides = useFeatureFlagStore((state) => state.clearOverrides)
  const overrides = useFeatureFlagStore((state) => state.overrides)
  const isLoaded = useFeatureFlagStore((state) => state.isLoaded)

  return {
    setOverride,
    clearOverrides,
    overrides,
    isLoaded,
  }
}
