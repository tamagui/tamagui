import { useCallback, useState } from 'react'

export function useBoundedNumberState(value: number, min: number, max: number) {
  const [x, setX] = useState(value)
  return [
    x,
    useCallback((n) => {
      if (n < min || n > max) return
      setX(n)
    }, []),
  ]
}
