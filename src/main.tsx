import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import { App } from '@/app/App'
import { reportWebVitals } from '@/core/performance'

import '@/styles/globals.css'

async function enableMocking() {
  // Only enable MSW in development when VITE_MSW_ENABLED is true
  if (import.meta.env.DEV && import.meta.env.VITE_MSW_ENABLED === 'true') {
    const { initMsw } = await import('@/test/mocks/initMsw')
    return initMsw()
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})

// Report Web Vitals metrics
reportWebVitals()
