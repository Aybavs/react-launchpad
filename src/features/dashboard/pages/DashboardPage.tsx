import { useTranslation } from 'react-i18next'

import { useAuth } from '@/core/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui'

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {t('navigation.dashboard')}
        </h1>
        <p className="text-text-secondary">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">1,234</p>
            <p className="text-text-muted">Total users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">$12,345</p>
            <p className="text-text-muted">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-secondary">42</p>
            <p className="text-text-muted">In progress</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted">
            This is a demo dashboard. Replace this content with your actual
            dashboard widgets.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
