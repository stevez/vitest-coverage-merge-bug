import { describe, it, expect } from 'vitest'
import { COLORS, SIZES, CONFIG } from './constants'

describe('constants (browser test)', () => {
  it('should have colors array', () => {
    expect(COLORS).toContain('red')
    expect(COLORS).toContain('blue')
  })

  it('should have sizes array', () => {
    expect(SIZES).toContain('small')
    expect(SIZES).toContain('large')
  })

  it('should have config object', () => {
    expect(CONFIG).toBeDefined()
    expect(CONFIG.enabled).toBe(true)
  })
})
