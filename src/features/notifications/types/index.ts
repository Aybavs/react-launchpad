export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
  actionUrl?: string
  metadata?: Record<string, unknown>
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface NotificationsFilters {
  read?: boolean
  type?: NotificationType
  page?: number
  limit?: number
}

export interface NotificationsResponse {
  data: Notification[]
  total: number
  unreadCount: number
}
