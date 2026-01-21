import { useTranslation } from 'react-i18next'

import { useAuth } from '@/core/auth'
import { useUIStore } from '@/core/store'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/core/ui'
import i18n from '@/i18n'

export function SettingsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { theme, setTheme } = useUIStore()

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {t('navigation.settings')}
        </h1>
        <p className="text-text-secondary">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary">
                Name
              </label>
              <p className="text-text-secondary">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary">
                Email
              </label>
              <p className="text-text-secondary">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary">
                Role
              </label>
              <p className="text-text-secondary capitalize">{user?.role}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Theme
              </label>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={theme === t ? 'default' : 'outline'}
                    onClick={() => setTheme(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Language
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={i18n.language === 'en' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('en')}
                >
                  English
                </Button>
                <Button
                  size="sm"
                  variant={i18n.language === 'tr' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('tr')}
                >
                  Türkçe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
