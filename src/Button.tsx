import { COLORS, SIZES, type Color, type Size } from './constants'

interface ButtonProps {
  color?: Color
  size?: Size
  children: React.ReactNode
  onClick?: () => void
}

export function Button({
  color = 'blue',
  size = 'medium',
  children,
  onClick,
}: ButtonProps) {
  const isValidColor = COLORS.includes(color)
  const isValidSize = SIZES.includes(size)

  if (!isValidColor || !isValidSize) {
    return null
  }

  return (
    <button
      onClick={onClick}
      data-color={color}
      data-size={size}
    >
      {children}
    </button>
  )
}
