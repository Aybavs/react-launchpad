import { useEffect } from 'react'

import { useUIStore } from '../slices/uiSlice'

/**
 * Synchronizes the theme state with the DOM.
 * Adds 'light' or 'dark' class to the document root element.
 * Should be called once at the app root level.
 */
export function useThemeSync() {
  const theme = useUIStore((state) => state.theme)

  useEffect(() => {
    const root = window.document.documentElement

    const applyTheme = (resolvedTheme: 'light' | 'dark') => {
      root.classList.remove('light', 'dark')
      root.classList.add(resolvedTheme)
    }

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      applyTheme(systemTheme)

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light')
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      applyTheme(theme)
    }
  }, [theme])
}
