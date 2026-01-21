/**
 * Type-safe API Client using OpenAPI types
 *
 * This client uses openapi-fetch for type-safe API calls.
 * Types are generated from your OpenAPI specification.
 *
 * Usage:
 * ```ts
 * import { api } from '@/api-types/client'
 *
 * // Fully typed request and response
 * const { data, error } = await api.GET('/users', {
 *   params: { query: { page: 1, limit: 10 } }
 * })
 *
 * // TypeScript knows the shape of data and error
 * if (data) {
 *   console.log(data.data) // User[]
 *   console.log(data.meta) // PaginationMeta
 * }
 * ```
 */

import createClient from 'openapi-fetch'

import { env } from '@/config/env'

import type { paths } from './schema'

/**
 * Type-safe API client instance
 * Uses generated OpenAPI types for full type safety
 */
export const api = createClient<paths>({
  baseUrl: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Set authorization header for authenticated requests
 */
export function setAuthToken(token: string): void {
  api.use({
    onRequest({ request }) {
      request.headers.set('Authorization', `Bearer ${token}`)
      return request
    },
  })
}

/**
 * Clear authorization header (for logout)
 */
export function clearAuthToken(): void {
  api.use({
    onRequest({ request }) {
      request.headers.delete('Authorization')
      return request
    },
  })
}

// Re-export types for convenience
export type { paths, components } from './schema'
