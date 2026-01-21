import { useState, useEffect, useCallback } from 'react'

import {
  reportWebVitals,
  formatMetricValue,
  getMetricThresholds,
} from './webVitals'

import type { WebVitalsMetric } from './webVitals'

interface PerformanceMetrics {
  CLS?: WebVitalsMetric
  FCP?: WebVitalsMetric
  FID?: WebVitalsMetric
  INP?: WebVitalsMetric
  LCP?: WebVitalsMetric
  TTFB?: WebVitalsMetric
}

interface UsePerformanceMonitorOptions {
  enabled?: boolean
  onMetric?: (metric: WebVitalsMetric) => void
}

export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions = {}
) {
  const { enabled = true, onMetric } = options
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [isLoading, setIsLoading] = useState(enabled)

  const handleMetric = useCallback(
    (metric: WebVitalsMetric) => {
      setMetrics((prev) => ({
        ...prev,
        [metric.name]: metric,
      }))
      onMetric?.(metric)
    },
    [onMetric]
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    reportWebVitals(handleMetric).then(() => {
      setIsLoading(false)
    })
  }, [enabled, handleMetric])

  const getFormattedMetrics = useCallback(() => {
    return Object.entries(metrics).map(([name, metric]) => ({
      name,
      value: formatMetricValue(metric),
      rawValue: metric.value,
      rating: metric.rating,
      thresholds: getMetricThresholds(name),
    }))
  }, [metrics])

  const getOverallScore = useCallback(() => {
    const metricsList = Object.values(metrics)
    if (metricsList.length === 0) return null

    const scores: number[] = metricsList.map((metric) => {
      if (metric.rating === 'good') return 100
      if (metric.rating === 'needs-improvement') return 50
      return 0
    })

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }, [metrics])

  return {
    metrics,
    isLoading,
    getFormattedMetrics,
    getOverallScore,
  }
}
