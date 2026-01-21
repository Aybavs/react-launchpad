/**
 * Feature flag definitions
 * Add new feature flags here with their default values
 */
export interface FeatureFlags {
  // Example flags - customize for your app
  'new-dashboard': boolean
  'dark-mode-v2': boolean
  'beta-features': boolean
  'maintenance-mode': boolean
}

export type FeatureFlagKey = keyof FeatureFlags

export type FeatureFlagValue = boolean | string | number

export interface FeatureFlagConfig {
  /**
   * Default values for feature flags
   * Used when remote flags are not available
   */
  defaults: FeatureFlags
  /**
   * Local overrides for development/testing
   * These take precedence over remote flags
   */
  overrides?: Partial<FeatureFlags>
}
