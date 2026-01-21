import type { ReactNode } from 'react'

export interface RouteMeta {
  requiresAuth?: boolean
  requiresGuest?: boolean
  roles?: string[]
  title?: string
}

export interface FeatureRoute {
  path: string
  element: ReactNode
  children?: FeatureRoute[]
  meta?: RouteMeta
}
