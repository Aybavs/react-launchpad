import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import { env } from '@/config'

export function AuthLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-secondary px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">
          {env.APP_NAME || t('app.name')}
        </h1>
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
