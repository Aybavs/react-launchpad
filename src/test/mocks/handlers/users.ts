import { http, HttpResponse, delay } from 'msw'

import type { User, UsersFilters, UsersResponse } from '@/features/users'

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-12-01T08:00:00Z',
  },
  {
    id: '2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-20T14:45:00Z',
    updatedAt: '2024-12-02T09:30:00Z',
  },
  {
    id: '3',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-10-15T16:20:00Z',
  },
  {
    id: '4',
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    role: 'moderator',
    status: 'active',
    createdAt: '2024-04-05T11:15:00Z',
    updatedAt: '2024-12-03T07:45:00Z',
  },
  {
    id: '5',
    email: 'charlie@example.com',
    firstName: 'Charlie',
    lastName: 'Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    role: 'user',
    status: 'pending',
    createdAt: '2024-05-22T16:30:00Z',
    updatedAt: '2024-05-22T16:30:00Z',
  },
]

export const usersHandlers = [
  // Get all users with pagination and filters
  http.get('*/api/users', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)

    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    const role = url.searchParams.get('role') as UsersFilters['role']
    const status = url.searchParams.get('status') as UsersFilters['status']
    const sortBy = url.searchParams.get('sortBy') || 'createdAt'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'

    let filteredUsers = [...mockUsers]

    // Apply search filter
    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply role filter
    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    // Apply status filter
    if (status) {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy as keyof User] || ''
      const bValue = b[sortBy as keyof User] || ''
      const comparison = String(aValue).localeCompare(String(bValue))
      return sortOrder === 'desc' ? -comparison : comparison
    })

    // Apply pagination
    const total = filteredUsers.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedUsers = filteredUsers.slice(start, start + limit)

    const response: UsersResponse = {
      data: paginatedUsers,
      total,
      page,
      limit,
      totalPages,
    }

    return HttpResponse.json(response)
  }),

  // Get single user
  http.get('*/api/users/:id', async ({ params }) => {
    await delay(300)
    const { id } = params
    const user = mockUsers.find((u) => u.id === id)

    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return HttpResponse.json(user)
  }),

  // Create user
  http.post('*/api/users', async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as Partial<User>

    const newUser: User = {
      id: crypto.randomUUID(),
      email: body.email || '',
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.firstName}`,
      role: body.role || 'user',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)
    return HttpResponse.json(newUser, { status: 201 })
  }),

  // Update user
  http.patch('*/api/users/:id', async ({ params, request }) => {
    await delay(400)
    const { id } = params
    const body = (await request.json()) as Partial<User>
    const userIndex = mockUsers.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(mockUsers[userIndex])
  }),

  // Delete user
  http.delete('*/api/users/:id', async ({ params }) => {
    await delay(300)
    const { id } = params
    const userIndex = mockUsers.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    mockUsers.splice(userIndex, 1)
    return HttpResponse.json({ success: true })
  }),
]
