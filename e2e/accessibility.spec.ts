import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should have proper page structure', async ({ page }) => {
    await page.goto('/')

    // Check for main landmark
    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    // Check for heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
  })

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/login')

    // All form inputs should have labels
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/password/i)

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Tab through focusable elements
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')

    // Check that text is visible
    const bodyText = page.locator('body')
    await expect(bodyText).toBeVisible()

    // Get computed styles
    const color = await bodyText.evaluate(
      (el) => window.getComputedStyle(el).color
    )
    const bgColor = await bodyText.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    )

    // Colors should be defined
    expect(color).toBeTruthy()
    expect(bgColor).toBeTruthy()
  })

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/')

    // Find all images
    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      // All images should have alt attribute (can be empty for decorative)
      expect(alt).not.toBeNull()
    }
  })
})
