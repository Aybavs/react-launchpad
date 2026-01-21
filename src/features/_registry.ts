// Feature Registry
// This file documents all available features in the application.
// Routes are configured centrally in src/app/router/routes.tsx

export const features = {
  auth: {
    name: 'Authentication',
    routes: ['/login', '/register'],
  },
  dashboard: {
    name: 'Dashboard',
    routes: ['/dashboard'],
  },
  users: {
    name: 'User Management',
    routes: ['/users'],
  },
  settings: {
    name: 'Settings',
    routes: ['/settings'],
  },
  notifications: {
    name: 'Notifications',
    routes: [],
  },
} as const
