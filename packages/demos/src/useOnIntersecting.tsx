import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { debounce, isWeb, useEvent } from 'tamagui'

type DisposeFn = () => void

type IntersectCallback = (
  props: (IntersectionObserverEntry | null)[],
  didResize?: boolean
) => DisposeFn | void | null

type Options = IntersectionObserverInit & {
  ignoreResize?: boolean
}

type HTMLRef = MutableRefObject<HTMLElement | null>

export function useIsIntersecting<Ref extends HTMLRef | HTMLRef[]>(
  refs: Ref,
  { once, ...opts }: Options & { once?: boolean } = {}
): Ref extends any[] ? boolean[] : boolean {
  const [values, setValues] = useState<boolean[]>([])

  if (isWeb) {
    useOnIntersecting(
      refs,
      (entries) => {
        const intersecting = entries.some((x) => x?.isIntersecting)
        if ((once && intersecting) || !once) {
          setValues((prev) => {
            const next = entries.map((e) => e?.isIntersecting ?? false)
            if (prev.every((e, i) => e === next[i])) {
              return prev
            }
            return next
          })
        }
      },
      opts
    )
  }

  return (Array.isArray(refs) ? values : Boolean(values[0])) as any
}

export function useOnIntersecting<Ref extends HTMLRef | HTMLRef[]>(
  refsIn: Ref,
  incomingCbRaw: IntersectCallback,
  { threshold = 1, ignoreResize, root, rootMargin }: Options = {
    threshold: 1,
  },
  mountArgs: any[] = []
) {
  const onIntersectEvent = useEvent(incomingCbRaw)

  useEffect(() => {
    const refs = (Array.isArray(refsIn) ? refsIn : [refsIn]) as HTMLRef[]
    if (!refs.length) return

    // only when carousel is fully in viewport
    let dispose: DisposeFn | null = null
    let currentEntries: (IntersectionObserverEntry | null)[] = refs.map(() => null)

    const options = {
      threshold,
      root,
      rootMargin,
    }

    const io = new IntersectionObserver((entries) => {
      currentEntries = refs.map((ref, index) => {
        return entries.find((x) => x.target === ref.current) ?? currentEntries[index] ?? null
      })
      dispose?.()
      dispose = onIntersectEvent(currentEntries) || null
    }, options)

    let ro: ResizeObserver | null = null
    if (!ignoreResize) {
      ro = new ResizeObserver(
        debounce(() => {
          dispose?.()
          dispose = onIntersectEvent(currentEntries, true) || null
        }, 32)
      )
      ro.observe(document.body)
    }

    for (const ref of refs) {
      if (ref.current) {
        io.observe(ref.current)
        ro?.observe(ref.current)
      }
    }

    return () => {
      dispose?.()
      ro?.disconnect()
      io.disconnect()
    }
  }, [
    ignoreResize,
    onIntersectEvent,
    refsIn,
    root,
    rootMargin,
    threshold,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...mountArgs,
  ])
}
