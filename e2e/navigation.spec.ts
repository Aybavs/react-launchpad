import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/boilerplate/i)
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')

    // Check if main navigation exists
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()
  })

  test('should display 404 for unknown routes', async ({ page }) => {
    await page.goto('/unknown-page-that-does-not-exist')

    await expect(page.getByText(/404|not found|page not found/i)).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Page should still be functional
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Theme', () => {
  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/')

    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i })

    if (await themeToggle.isVisible()) {
      // Get initial theme
      const html = page.locator('html')
      const initialClass = await html.getAttribute('class')

      // Click toggle
      await themeToggle.click()

      // Theme should change
      const newClass = await html.getAttribute('class')
      expect(newClass).not.toBe(initialClass)
    }
  })
})
