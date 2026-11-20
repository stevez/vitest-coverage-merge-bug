import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { Stars } from './Stars'
import { MAX_UPLOAD_SIZE } from './limits'

describe('Stars (browser test)', () => {
  it('renders one span per star', async () => {
    render(<Stars count={2} max={4} />)
    await expect.element(page.getByLabelText('2 of 4')).toBeVisible()
  })

  it('exposes the upload limit', () => {
    expect(MAX_UPLOAD_SIZE).toBe(5242880)
  })
})
