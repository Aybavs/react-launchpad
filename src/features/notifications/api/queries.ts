import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/core/api'

import type {
  Notification,
  NotificationsFilters,
  NotificationsResponse,
} from '../types'

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: NotificationsFilters) =>
    [...notificationKeys.lists(), filters] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  detail: (id: string) => [...notificationKeys.all, 'detail', id] as const,
}

export function useNotifications(filters: NotificationsFilters = {}) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.read !== undefined) params.set('read', String(filters.read))
      if (filters.type) params.set('type', filters.type)
      if (filters.page) params.set('page', String(filters.page))
      if (filters.limit) params.set('limit', String(filters.limit))

      const response = await apiClient.get<NotificationsResponse>(
        `/notifications?${params}`
      )
      return response.data
    },
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await apiClient.get<{ count: number }>(
        '/notifications/unread-count'
      )
      return response.data.count
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useNotification(id: string) {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Notification>(`/notifications/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}
