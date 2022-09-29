import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { debounce, isWeb, useEvent } from 'tamagui'

type DisposeFn = () => void
type IntersectFn = (
  props: IntersectionObserverEntry & { dispose?: DisposeFn | null },
  didResize?: boolean
) => void | DisposeFn

type HTMLRef = MutableRefObject<HTMLElement | null>

export const useIsIntersecting = (
  refs: HTMLRef | HTMLRef[],
  { once, ...opts }: IntersectionObserverInit & { once?: boolean } = {}
) => {
  const [val, setVal] = useState(!isWeb)
  if (isWeb) {
    useOnIntersecting(
      refs,
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
  refsIn: HTMLRef | HTMLRef[],
  incomingCb: IntersectFn,
  options: IntersectionObserverInit = {
    threshold: 1,
  },
  mountArgs: any[] = []
) => {
  useEffect(() => {
    const refs = Array.isArray(refsIn) ? refsIn : [refsIn]
    if (!refs.length || !incomingCb) return

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
    for (const ref of refs) {
      if (ref.current) {
        io.observe(ref.current)
      }
    }

    return () => {
      dispose?.()
      ro.disconnect()
      io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingCb, refsIn, options, ...mountArgs])
}
