import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { debounce, isWeb, useEvent } from 'tamagui'

type DisposeFn = () => void
type IntersectFn = (
  props: IntersectionObserverEntry & { dispose?: DisposeFn | null },
  didResize?: boolean
) => void | DisposeFn

export const useIsIntersecting = (
  ref: MutableRefObject<HTMLElement | null>,
  { once, ...opts }: IntersectionObserverInit & { once?: boolean } = {}
) => {
  const [val, setVal] = useState(!isWeb)
  if (isWeb) {
    useOnIntersecting(
      ref,
      useEvent(({ isIntersecting }) => {
        if ((once && isIntersecting) || !once) {
          setVal(isIntersecting)
        }
      }),
      opts
    )
  }
  return val
}

export const useOnIntersecting = (
  ref: MutableRefObject<HTMLElement | null>,
  incomingCb: IntersectFn,
  options: IntersectionObserverInit = {
    threshold: 1,
  },
  mountArgs: any[] = []
) => {
  useEffect(() => {
    const node = ref.current
    if (!node || !incomingCb) return

    // only when carousel is fully in viewport
    let dispose: DisposeFn | null = null
    let lastEntry: any

    const io = new IntersectionObserver(([entry]) => {
      lastEntry = new Proxy(entry, {
        get(target, key) {
          if (key === 'dispose') return dispose
          return target[key]
        },
      })
      dispose?.()
      if (!entry.isIntersecting) {
        incomingCb(lastEntry)
      } else {
        dispose = incomingCb(lastEntry) || null
      }
    }, options)

    const ro = new ResizeObserver(
      debounce(() => {
        if (!lastEntry) {
          return
        }
        dispose = incomingCb(lastEntry, true) || null
      }, 80)
    )

    ro.observe(document.body)
    io.observe(node)

    return () => {
      dispose?.()
      ro.disconnect()
      io.disconnect()
    }
  }, [ref.current, incomingCb, ...mountArgs])
}
