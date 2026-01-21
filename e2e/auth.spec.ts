import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display login page for unauthenticated users', async ({
    page,
  }) => {
    await page.goto('/login')
    await expect(
      page.getByRole('heading', { name: /login|sign in/i })
    ).toBeVisible()
  })

  test('should show validation errors for empty form submission', async ({
    page,
  }) => {
    await page.goto('/login')

    // Try to submit empty form
    await page.getByRole('button', { name: /login|sign in/i }).click()

    // Check for validation errors
    await expect(page.getByText(/email|required/i)).toBeVisible()
  })

  test('should redirect to dashboard after successful login', async ({
    page,
  }) => {
    await page.goto('/login')

    // Fill in credentials
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')

    // Submit form
    await page.getByRole('button', { name: /login|sign in/i }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/)
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')

    // Submit form
    await page.getByRole('button', { name: /login|sign in/i }).click()

    // Should show error message
    await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /login|sign in/i }).click()

    // Wait for dashboard
    await expect(page).toHaveURL(/dashboard/)

    // Click logout
    await page.getByRole('button', { name: /logout|sign out/i }).click()

    // Should redirect to login
    await expect(page).toHaveURL(/login/)
  })
})
