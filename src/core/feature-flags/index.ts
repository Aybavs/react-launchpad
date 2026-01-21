// Feature Flags module
// Provides feature flag management with PostHog integration and local overrides

// Components
export { FeatureFlag, FeatureFlagOff } from './FeatureFlag'
export { FeatureFlagDevTools } from './FeatureFlagDevTools'

// Hooks
export {
  useFeatureFlag,
  useFeatureFlagValue,
  useFeatureFlagOverrides,
} from './useFeatureFlag'

// Store & initialization
export { useFeatureFlagStore, initFeatureFlags } from './store'

// Types
export type { FeatureFlags, FeatureFlagKey, FeatureFlagConfig } from './types'
