/**
 * Initialize MSW for browser development
 *
 * Usage in main.tsx:
 * ```typescript
 * import { initMsw } from '@/test/mocks/initMsw'
 *
 * initMsw().then(() => {
 *   createRoot(document.getElementById('root')!).render(...)
 * })
 * ```
 *
 * Or conditionally:
 * ```typescript
 * async function enableMocking() {
 *   if (import.meta.env.DEV && import.meta.env.VITE_MSW_ENABLED === 'true') {
 *     const { initMsw } = await import('@/test/mocks/initMsw')
 *     return initMsw()
 *   }
 * }
 *
 * enableMocking().then(() => {
 *   createRoot(document.getElementById('root')!).render(...)
 * })
 * ```
 */
export async function initMsw() {
  if (typeof window === 'undefined') {
    return
  }

  const { worker } = await import('./browser')

  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}

/**
 * Check if MSW should be enabled
 */
export function shouldEnableMsw(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_MSW_ENABLED === 'true'
}
