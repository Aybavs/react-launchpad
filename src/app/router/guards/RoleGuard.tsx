import type { ReactNode } from 'react'

import { Navigate } from 'react-router'

import { ROUTES } from '@/config'
import { useAuth } from '@/core/auth'
import type { UserRole } from '@/core/auth'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallbackPath?: string
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = ROUTES.DASHBOARD,
}: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}
