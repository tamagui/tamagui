import { useEffect, useState } from 'react'

export function useResizeObserver(ref: any | null, enabled = true) {
  const [size, setSize] = useState({ width: 0, height: 0, x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const { width, height, x, y } = entries[0].contentRect
      setSize({ width, height, x, y })
    })

    if (ref) {
      observer.observe(ref, {
        box: 'border-box',
      })
    }

    return () => {
      if (ref) {
        observer.unobserve(ref)
      }
    }
  }, [ref, enabled])

  return size
}

export default useResizeObserver
