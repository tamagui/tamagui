import throttle from 'lodash.throttle'
import { MutableRefObject, useEffect } from 'react'
import { debounce } from 'tamagui'

type DisposeFn = () => void

export const useOnIntersecting = (
  ref: MutableRefObject<HTMLElement | null>,
  cb: (
    props: IntersectionObserverEntry & { dispose?: DisposeFn | null },
    didResize?: boolean
  ) => void | DisposeFn
) => {
  // arrow keys
  useEffect(() => {
    const node = ref.current
    if (!node) return
    // only when carousel is fully in viewport
    let dispose: DisposeFn | null = null
    let lastEntry: any

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lastEntry = new Proxy(entry, {
            get(target, key) {
              if (key === 'dispose') {
                return dispose
              }
              return Reflect.get(target, key)
            },
          })
          dispose?.()
          dispose = cb(lastEntry) || null
        } else {
          dispose?.()
        }
      },
      {
        threshold: 1,
      }
    )

    const ro = new ResizeObserver(
      debounce(() => {
        if (!lastEntry) {
          return
        }
        dispose = cb(lastEntry, true) || null
      }, 150)
    )

    ro.observe(document.body)
    io.observe(node)

    return () => {
      dispose?.()
      ro.disconnect()
      io.disconnect()
    }
  }, [ref.current])
}
