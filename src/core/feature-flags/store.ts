import { create } from 'zustand'

import {
  isFeatureEnabled,
  getFeatureFlag,
  onFeatureFlagsLoaded,
} from '../analytics'

import type { FeatureFlags, FeatureFlagKey, FeatureFlagConfig } from './types'

interface FeatureFlagState {
  flags: FeatureFlags
  isLoaded: boolean
  overrides: Partial<FeatureFlags>
  setOverride: (key: FeatureFlagKey, value: boolean) => void
  clearOverrides: () => void
  isEnabled: (key: FeatureFlagKey) => boolean
  getValue: <T extends boolean | string | number>(
    key: FeatureFlagKey
  ) => T | undefined
}

/**
 * Default feature flag values
 * These are used when remote flags are not available
 */
const defaultFlags: FeatureFlags = {
  'new-dashboard': false,
  'dark-mode-v2': false,
  'beta-features': false,
  'maintenance-mode': false,
}

export const useFeatureFlagStore = create<FeatureFlagState>((set, get) => ({
  flags: defaultFlags,
  isLoaded: false,
  overrides: {},

  setOverride: (key, value) => {
    set((state) => ({
      overrides: { ...state.overrides, [key]: value },
    }))
  },

  clearOverrides: () => {
    set({ overrides: {} })
  },

  isEnabled: (key) => {
    const { overrides, flags } = get()

    // Local overrides take precedence
    if (key in overrides) {
      return overrides[key] ?? false
    }

    // Try remote flag from PostHog
    const remoteValue = isFeatureEnabled(key)
    if (remoteValue !== undefined) {
      return remoteValue
    }

    // Fall back to default
    return flags[key] ?? false
  },

  getValue: <T extends boolean | string | number>(
    key: FeatureFlagKey
  ): T | undefined => {
    const { overrides } = get()

    // Local overrides take precedence
    if (key in overrides) {
      return overrides[key] as T
    }

    // Try remote flag from PostHog
    const remoteValue = getFeatureFlag(key)
    if (remoteValue !== undefined) {
      return remoteValue as T
    }

    return undefined
  },
}))

/**
 * Initialize feature flags
 * Call this after analytics is initialized
 */
export function initFeatureFlags(config?: FeatureFlagConfig): void {
  // Set defaults if provided
  if (config?.defaults) {
    useFeatureFlagStore.setState({
      flags: { ...defaultFlags, ...config.defaults },
    })
  }

  // Set overrides if provided
  if (config?.overrides) {
    useFeatureFlagStore.setState({ overrides: config.overrides })
  }

  // Listen for PostHog feature flags to load
  onFeatureFlagsLoaded(() => {
    useFeatureFlagStore.setState({ isLoaded: true })
  })
}
