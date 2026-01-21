import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation } from 'react-router'

import { ROUTES } from '@/config'
import { useAuth } from '@/core/auth'
import { useUIStore } from '@/core/store'
import { Button } from '@/core/ui'

const navItems = [
  { path: ROUTES.DASHBOARD, labelKey: 'navigation.dashboard' },
  { path: ROUTES.SETTINGS, labelKey: 'navigation.settings' },
] as const

export function DashboardLayout() {
  const { t } = useTranslation()
  const { logout, user } = useAuth()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-background-secondary">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col border-r border-border">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link
              to={ROUTES.DASHBOARD}
              className="text-lg font-bold text-text-primary"
            >
              {t('app.name')}
            </Link>
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 text-text-secondary hover:bg-background-secondary lg:hidden"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            <div className="mb-3 text-sm">
              <p className="font-medium text-text-primary">{user?.name}</p>
              <p className="text-text-muted">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" fullWidth onClick={logout}>
              {t('navigation.logout')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center border-b border-border bg-background px-4 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-text-secondary hover:bg-background-secondary"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}
