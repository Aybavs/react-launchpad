import { useState } from 'react'

import { useFeatureFlagStore } from './store'

import type { FeatureFlagKey } from './types'

/**
 * Development-only panel for managing feature flag overrides
 * Only renders in development mode
 *
 * @example
 * ```tsx
 * // In your app root (development only)
 * {import.meta.env.DEV && <FeatureFlagDevTools />}
 * ```
 */
export function FeatureFlagDevTools() {
  const [isOpen, setIsOpen] = useState(false)
  const flags = useFeatureFlagStore((state) => state.flags)
  const overrides = useFeatureFlagStore((state) => state.overrides)
  const isEnabled = useFeatureFlagStore((state) => state.isEnabled)
  const setOverride = useFeatureFlagStore((state) => state.setOverride)
  const clearOverrides = useFeatureFlagStore((state) => state.clearOverrides)

  // Only render in development
  if (!import.meta.env.DEV) {
    return null
  }

  const flagKeys = Object.keys(flags) as FeatureFlagKey[]

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-purple-600 p-3 text-white shadow-lg hover:bg-purple-700"
        title="Feature Flags"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Feature Flags
            </h3>
            <button
              onClick={clearOverrides}
              className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
            >
              Clear Overrides
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-3">
            {flagKeys.map((key) => {
              const enabled = isEnabled(key)
              const hasOverride = key in overrides

              return (
                <div
                  key={key}
                  className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <span
                      className={`text-sm ${hasOverride ? 'font-semibold text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {key}
                    </span>
                    {hasOverride && (
                      <span className="ml-2 text-xs text-purple-500">
                        (override)
                      </span>
                    )}
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setOverride(key, e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                  </label>
                </div>
              )
            })}
          </div>

          <div className="border-t border-gray-200 p-2 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Development Only
          </div>
        </div>
      )}
    </>
  )
}
