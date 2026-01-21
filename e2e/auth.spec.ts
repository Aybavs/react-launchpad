import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should load login page', async ({ page }) => {
    const response = await page.goto('/login')
    expect(response?.status()).toBe(200)
  })
})
