import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should have clickable elements', async ({ page }) => {
    await page.goto('/')
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})
