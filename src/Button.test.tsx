import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Button } from './Button'

afterEach(() => {
  cleanup()
})

describe('Button (unit test)', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button').textContent).toBe('Click me')
  })

  it('should render with custom color and size', () => {
    render(<Button color="red" size="large">Test</Button>)
    const button = screen.getByRole('button')
    expect(button.getAttribute('data-color')).toBe('red')
    expect(button.getAttribute('data-size')).toBe('large')
  })

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
