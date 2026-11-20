import { useState } from 'react'

export function Stars({ count, max = 5 }: { count: number; max?: number }) {
  const [hovered, setHovered] = useState(0)
  const label = useLabel(count, max)

  return (
    <div aria-label={label} onMouseLeave={() => setHovered(0)}>
      {[...Array(max)].map((_, i) => (
        <span
          key={i}
          data-filled={i < (hovered || count)}
          onMouseEnter={() => setHovered(i + 1)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function useLabel(count: number, max: number) {
  return `${count} of ${max}`
}
