import { useState } from 'react'

import { clsx } from 'clsx'

import { usePerformanceMonitor } from './usePerformanceMonitor'

interface PerformanceMonitorProps {
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

/**
 * Development-only performance monitor overlay
 * Shows Web Vitals metrics in real-time
 */
export function PerformanceMonitor({
  className,
  position = 'bottom-right',
}: PerformanceMonitorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { getFormattedMetrics, getOverallScore, isLoading } =
    usePerformanceMonitor()

  // Only show in development
  if (!import.meta.env.DEV) {
    return null
  }

  const metrics = getFormattedMetrics()
  const overallScore = getOverallScore()

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-success'
      case 'needs-improvement':
        return 'text-warning'
      case 'poor':
        return 'text-error'
      default:
        return 'text-text-secondary'
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-background-tertiary'
    if (score >= 90) return 'bg-success'
    if (score >= 50) return 'bg-warning'
    return 'bg-error'
  }

  return (
    <div
      className={clsx(
        'fixed z-9999 font-mono text-xs',
        positionClasses[position],
        className
      )}
    >
      {isExpanded ? (
        <div className="rounded-lg border border-border bg-background p-3 shadow-lg min-w-50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-text-primary">Web Vitals</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-text-secondary hover:text-text-primary"
            >
              ✕
            </button>
          </div>

          {isLoading ? (
            <div className="text-text-secondary">Loading metrics...</div>
          ) : metrics.length === 0 ? (
            <div className="text-text-secondary">No metrics yet</div>
          ) : (
            <div className="space-y-1.5">
              {metrics.map(({ name, value, rating }) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-text-secondary">{name}</span>
                  <span className={getRatingColor(rating)}>{value}</span>
                </div>
              ))}
              {overallScore !== null && (
                <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-text-secondary">Score</span>
                  <span
                    className={clsx(
                      'px-2 py-0.5 rounded text-white text-[10px] font-bold',
                      getScoreColor(overallScore)
                    )}
                  >
                    {overallScore}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className={clsx(
            'flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-lg border border-border',
            'bg-background hover:bg-background-secondary transition-colors',
            'text-text-secondary hover:text-text-primary'
          )}
          title="Web Vitals Monitor"
        >
          <span className="text-[10px]">⚡</span>
          {overallScore !== null && (
            <span
              className={clsx(
                'px-1.5 py-0.5 rounded text-white text-[10px] font-bold',
                getScoreColor(overallScore)
              )}
            >
              {overallScore}
            </span>
          )}
        </button>
      )}
    </div>
  )
}
