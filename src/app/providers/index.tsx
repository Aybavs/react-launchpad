import { Suspense } from 'react'
import type { ReactNode } from 'react'

import { Toaster } from 'sonner'

import { AuthProvider } from '@/core/auth'

import { ErrorBoundary } from './ErrorBoundary'
import { I18nProvider } from './I18nProvider'
import { PageLoader } from './PageLoader'
import { QueryProvider } from './QueryProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <I18nProvider>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>{children}</Suspense>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </I18nProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}
