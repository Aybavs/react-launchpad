import { PerformanceMonitor } from '@/core/performance'
import { useThemeSync } from '@/core/store'

import { AppProviders } from './providers'
import { AppRouter } from './router'

function AppContent() {
  useThemeSync()

  return (
    <>
      <AppRouter />
      <PerformanceMonitor position="bottom-left" />
    </>
  )
}

export function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  )
}
