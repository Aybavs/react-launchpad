import { http, HttpResponse, delay } from 'msw'

// Mock user type for auth handlers - matches core/auth User type
interface MockUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

const mockUser: MockUser = {
  id: '1',
  email: 'user@example.com',
  name: 'Test User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  role: 'user',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockAdmin: MockUser = {
  id: '2',
  email: 'admin@example.com',
  name: 'Admin User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

// Simulated token storage
let currentUser: MockUser | null = null

export const authHandlers = [
  // Login
  http.post('*/api/auth/login', async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as { email: string; password: string }

    if (body.email === 'admin@example.com' && body.password === 'password') {
      currentUser = mockAdmin
      return HttpResponse.json({
        user: mockAdmin,
        token: 'mock-admin-token',
      })
    }

    if (body.email === 'user@example.com' && body.password === 'password') {
      currentUser = mockUser
      return HttpResponse.json({
        user: mockUser,
        token: 'mock-user-token',
      })
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // Register
  http.post('*/api/auth/register', async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as {
      email: string
      password: string
      name: string
    }

    const newUser: MockUser = {
      id: crypto.randomUUID(),
      email: body.email,
      name: body.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.name}`,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    currentUser = newUser
    return HttpResponse.json(
      {
        user: newUser,
        token: 'mock-new-user-token',
      },
      { status: 201 }
    )
  }),

  // Logout
  http.post('*/api/auth/logout', async () => {
    await delay(200)
    currentUser = null
    return HttpResponse.json({ success: true })
  }),

  // Get current user (me)
  http.get('*/api/auth/me', async ({ request }) => {
    await delay(300)
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (currentUser) {
      return HttpResponse.json(currentUser)
    }

    // Default to returning mock user for testing
    return HttpResponse.json(mockUser)
  }),

  // Refresh token
  http.post('*/api/auth/refresh', async () => {
    await delay(200)
    return HttpResponse.json({
      token: 'mock-refreshed-token',
      expiresIn: 3600,
    })
  }),

  // Forgot password
  http.post('*/api/auth/forgot-password', async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as { email: string }

    return HttpResponse.json({
      message: `Password reset email sent to ${body.email}`,
    })
  }),

  // Reset password
  http.post('*/api/auth/reset-password', async () => {
    await delay(500)
    return HttpResponse.json({
      message: 'Password reset successfully',
    })
  }),
]
