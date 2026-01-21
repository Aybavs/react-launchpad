import { authHandlers } from './auth'
import { notificationsHandlers } from './notifications'
import { usersHandlers } from './users'

export const handlers = [
  ...authHandlers,
  ...usersHandlers,
  ...notificationsHandlers,
]

// Re-export individual handlers for selective use
export { authHandlers } from './auth'
export { usersHandlers } from './users'
export { notificationsHandlers } from './notifications'
