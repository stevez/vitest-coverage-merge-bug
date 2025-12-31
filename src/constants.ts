export const COLORS = [
  'red',
  'green',
  'blue',
  'yellow',
  'purple',
] as const

export const SIZES = ['small', 'medium', 'large'] as const

export const CONFIG = {
  maxItems: 100,
  timeout: 5000,
  enabled: true,
} as const

export type Color = (typeof COLORS)[number]
export type Size = (typeof SIZES)[number]
