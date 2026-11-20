import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Stars } from './Stars'
import { MAX_UPLOAD_SIZE } from './limits'

afterEach(() => cleanup())

describe('Stars (unit test)', () => {
  it('renders one span per star', () => {
    render(<Stars count={3} />)
    expect(screen.getByLabelText('3 of 5').querySelectorAll('span')).toHaveLength(5)
  })

  it('exposes the upload limit', () => {
    expect(MAX_UPLOAD_SIZE).toBe(5242880)
  })
})
