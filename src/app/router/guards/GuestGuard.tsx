import type { ReactNode } from 'react'

import { Navigate } from 'react-router'

import { ROUTES } from '@/config'
import { useAuth } from '@/core/auth'

interface GuestGuardProps {
  children: ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (isAuthenticated) {
    // Redirect based on user role
    const redirectPath =
      user?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}
