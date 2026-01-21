import { describe, it, expect } from 'vitest'

import { cn } from './cn'

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe(
      'base active'
    )
  })

  it('should merge conflicting tailwind classes', () => {
    // twMerge should keep the last conflicting class
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('should handle undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('should handle arrays', () => {
    expect(cn(['text-sm', 'font-bold'])).toBe('text-sm font-bold')
  })
})
