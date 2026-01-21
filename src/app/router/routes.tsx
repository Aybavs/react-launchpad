import { lazy } from 'react'

import { Navigate } from 'react-router'

import { ROUTES } from '@/config'

import { AdminLayout } from '../layouts/AdminLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { RootLayout } from '../layouts/RootLayout'
import { AuthGuard } from './guards/AuthGuard'
import { GuestGuard } from './guards/GuestGuard'
import { RoleGuard } from './guards/RoleGuard'

import type { RouteObject } from 'react-router'

// Lazy load pages
const LoginPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.LoginPage }))
)
const RegisterPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.RegisterPage }))
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.DashboardPage }))
)
const AdminDashboardPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({
    default: m.AdminDashboardPage,
  }))
)
const SettingsPage = lazy(() =>
  import('@/features/settings').then((m) => ({ default: m.SettingsPage }))
)
const UsersPage = lazy(() =>
  import('@/features/users').then((m) => ({ default: m.UsersPage }))
)

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Redirect root to dashboard
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },

      // Auth routes (guest only)
      {
        element: (
          <GuestGuard>
            <AuthLayout />
          </GuestGuard>
        ),
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },

      // User protected routes
      {
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },

      // Admin protected routes
      {
        path: 'admin',
        element: (
          <RoleGuard allowedRoles={['admin']} fallbackPath={ROUTES.DASHBOARD}>
            <AdminLayout />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]
