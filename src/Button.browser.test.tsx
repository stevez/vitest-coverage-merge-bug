import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from '@vitest/browser/context'
import { Button } from './Button'

describe('Button (browser test)', () => {
  it('should render button in browser', async () => {
    render(<Button>Browser Button</Button>)
    await expect.element(page.getByRole('button')).toHaveTextContent('Browser Button')
  })

  it('should have correct attributes', async () => {
    render(<Button color="green" size="small">Styled</Button>)
    const button = page.getByRole('button')
    await expect.element(button).toHaveAttribute('data-color', 'green')
    await expect.element(button).toHaveAttribute('data-size', 'small')
  })

  it('should handle click', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    await page.getByRole('button').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
