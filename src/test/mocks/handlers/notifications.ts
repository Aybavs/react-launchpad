import { http, HttpResponse, delay } from 'msw'

import type {
  Notification,
  NotificationsFilters,
  NotificationsResponse,
} from '@/features/notifications'

// Mock notifications database
let mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Welcome to the app!',
    message:
      'Thanks for joining us. Explore the features and let us know if you have questions.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  {
    id: '2',
    type: 'success',
    title: 'Profile updated',
    message: 'Your profile information has been successfully updated.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: '3',
    type: 'warning',
    title: 'Password expiring soon',
    message:
      'Your password will expire in 7 days. Please update it to maintain account security.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '4',
    type: 'error',
    title: 'Payment failed',
    message:
      'Your last payment could not be processed. Please update your payment method.',
    read: false,
    actionUrl: '/settings/billing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '5',
    type: 'info',
    title: 'New feature available',
    message: 'Check out our new dashboard analytics feature.',
    read: true,
    actionUrl: '/dashboard/analytics',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
]

export const notificationsHandlers = [
  // Get all notifications with pagination and filters
  http.get('*/api/notifications', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)

    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const type = url.searchParams.get('type') as NotificationsFilters['type']
    const read = url.searchParams.get('read')

    let filteredNotifications = [...mockNotifications]

    // Apply type filter
    if (type) {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.type === type
      )
    }

    // Apply read filter
    if (read !== null && read !== undefined) {
      const isRead = read === 'true'
      filteredNotifications = filteredNotifications.filter(
        (n) => n.read === isRead
      )
    }

    // Sort by createdAt (newest first)
    filteredNotifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Apply pagination
    const total = filteredNotifications.length
    const start = (page - 1) * limit
    const paginatedNotifications = filteredNotifications.slice(
      start,
      start + limit
    )

    const unreadCount = mockNotifications.filter((n) => !n.read).length

    const response: NotificationsResponse = {
      data: paginatedNotifications,
      total,
      unreadCount,
    }

    return HttpResponse.json(response)
  }),

  // Get unread count
  http.get('*/api/notifications/unread-count', async () => {
    await delay(200)
    const count = mockNotifications.filter((n) => !n.read).length
    return HttpResponse.json({ count })
  }),

  // Get single notification
  http.get('*/api/notifications/:id', async ({ params }) => {
    await delay(200)
    const { id } = params
    const notification = mockNotifications.find((n) => n.id === id)

    if (!notification) {
      return HttpResponse.json(
        { message: 'Notification not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(notification)
  }),

  // Mark notification as read
  http.patch('*/api/notifications/:id/read', async ({ params }) => {
    await delay(200)
    const { id } = params
    const notification = mockNotifications.find((n) => n.id === id)

    if (!notification) {
      return HttpResponse.json(
        { message: 'Notification not found' },
        { status: 404 }
      )
    }

    notification.read = true
    return HttpResponse.json(notification)
  }),

  // Mark all notifications as read
  http.post('*/api/notifications/mark-all-read', async () => {
    await delay(300)
    mockNotifications = mockNotifications.map((n) => ({ ...n, read: true }))
    return HttpResponse.json({ success: true })
  }),

  // Delete notification
  http.delete('*/api/notifications/:id', async ({ params }) => {
    await delay(200)
    const { id } = params
    const index = mockNotifications.findIndex((n) => n.id === id)

    if (index === -1) {
      return HttpResponse.json(
        { message: 'Notification not found' },
        { status: 404 }
      )
    }

    mockNotifications.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  // Clear all notifications
  http.delete('*/api/notifications', async () => {
    await delay(300)
    mockNotifications = []
    return HttpResponse.json({ success: true })
  }),
]
