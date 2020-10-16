import { useEffect, useRef } from 'react'

export function useVisibilityObserver(
  ref: React.RefObject<HTMLDivElement>,
  onVisible: (visibility: boolean) => any
) {
  const dispose = useRef<any>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver((entries) => {
      if (entries && entries[0]) {
        if (entries[0].isIntersecting) {
          onVisible(true)
        } else {
          onVisible(false)
        }
      }
    })
    observer.observe(node)
    dispose.current = () => {
      observer.disconnect()
    }
    return dispose.current
  }, [ref.current])

  return () => dispose.current && dispose.current()
}
