import type { Metric } from 'web-vitals'

export type WebVitalsMetric = Metric

export type ReportHandler = (metric: WebVitalsMetric) => void

const defaultHandler: ReportHandler = (metric) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    })
  }
}

/**
 * Reports Web Vitals metrics
 *
 * Metrics tracked:
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FCP (First Contentful Paint): First render
 * - INP (Interaction to Next Paint): Responsiveness
 * - LCP (Largest Contentful Paint): Loading performance
 * - TTFB (Time to First Byte): Server response
 */
export async function reportWebVitals(
  onReport: ReportHandler = defaultHandler
) {
  try {
    const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals')

    onCLS(onReport)
    onFCP(onReport)
    onINP(onReport)
    onLCP(onReport)
    onTTFB(onReport)
  } catch (error) {
    console.error('[Web Vitals] Failed to load:', error)
  }
}

/**
 * Send metrics to analytics endpoint
 */
export function sendToAnalytics(metric: WebVitalsMetric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  })

  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body)
  } else {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body,
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

/**
 * Get rating color for metric visualization
 */
export function getMetricRating(
  metric: WebVitalsMetric
): 'good' | 'needs-improvement' | 'poor' {
  return metric.rating
}

/**
 * Format metric value for display
 */
export function formatMetricValue(metric: WebVitalsMetric): string {
  switch (metric.name) {
    case 'CLS':
      return metric.value.toFixed(3)
    case 'FCP':
    case 'INP':
    case 'LCP':
    case 'TTFB':
      return `${Math.round(metric.value)}ms`
    default:
      return String(metric.value)
  }
}

/**
 * Get threshold values for each metric
 */
export function getMetricThresholds(name: string): {
  good: number
  poor: number
} {
  switch (name) {
    case 'CLS':
      return { good: 0.1, poor: 0.25 }
    case 'FCP':
      return { good: 1800, poor: 3000 }
    case 'INP':
      return { good: 200, poor: 500 }
    case 'LCP':
      return { good: 2500, poor: 4000 }
    case 'TTFB':
      return { good: 800, poor: 1800 }
    default:
      return { good: 0, poor: 0 }
  }
}
