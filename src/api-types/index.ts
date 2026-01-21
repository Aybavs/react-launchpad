/**
 * API Types Module
 *
 * Generated TypeScript types from OpenAPI specification.
 *
 * To regenerate types:
 *   pnpm generate:api-types
 *
 * To use a remote spec:
 *   pnpm generate:api-types https://api.example.com/openapi.json
 */

// Type-safe API client
export { api, setAuthToken, clearAuthToken } from './client'

// Re-export generated types (will be available after running generate:api-types)
export type * from './schema'
