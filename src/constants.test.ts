import { describe, it, expect } from 'vitest'
import { COLORS, SIZES, CONFIG } from './constants'

describe('constants (unit test)', () => {
  it('should have 5 colors', () => {
    expect(COLORS).toHaveLength(5)
  })

  it('should have 3 sizes', () => {
    expect(SIZES).toHaveLength(3)
  })

  it('should have correct config', () => {
    expect(CONFIG.maxItems).toBe(100)
    expect(CONFIG.timeout).toBe(5000)
    expect(CONFIG.enabled).toBe(true)
  })
})
