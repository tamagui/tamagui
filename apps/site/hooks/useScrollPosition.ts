import type { MutableRefObject} from 'react';
import { useEffect } from 'react'

type DisposeFn = () => void
type ScrollListenerFn = (e: Event) => void
type OnScrollProps = ReturnType<typeof percentScrolled>

export const useScrollPosition = ({
  ref: { current },
  onScroll,
}: {
  ref: MutableRefObject<HTMLElement | null>
  onScroll: (props: OnScrollProps) => void
}) => {
  useEffect(() => {
    if (!current) return
    let dispose: DisposeFn | null = null
    let isIntersecting = false

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting
      onScroll(percentScrolled(current, entry.boundingClientRect))
    })

    io.observe(current)

    dispose = scrollListen(() => {
      if (isIntersecting) {
        onScroll(percentScrolled(current))
      }
    })

    return () => {
      io.disconnect()
      dispose?.()
    }
  }, [current])
}

let disposeScrollListen: DisposeFn | null = null
const listeners = new Set<ScrollListenerFn>()

const scrollListen = (cb: ScrollListenerFn) => {
  listeners.add(cb)
  if (!disposeScrollListen) {
    const onScroll: ScrollListenerFn = (e) => {
      listeners.forEach((listener) => {
        listener(e)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    disposeScrollListen = () => {
      window.removeEventListener('scroll', onScroll)
    }
  }

  return () => {
    listeners.delete(cb)
    if (!listeners.size) {
      disposeScrollListen?.()
      disposeScrollListen = null
    }
  }
}

const percentScrolled = (
  element: HTMLElement,
  boundingRect: DOMRect = element.getBoundingClientRect()
) => {
  const scrollTop = window.scrollY
  const nodeOffsetY = scrollTop + boundingRect.top
  // Get the relevant measurements and positions
  const viewportHeight = window.innerHeight
  const elementHeight = element.offsetHeight
  // Calculate percentage of the element that's been seen
  const distance = scrollTop + viewportHeight - nodeOffsetY
  const percentage = Math.round(distance / ((viewportHeight + elementHeight) / 100))
  // Restrict the range to between 0 and 100
  return {
    percent: Math.min(100, Math.max(0, 100 - percentage)),
    distance,
    scrollTop,
    elementHeight,
    viewportHeight,
  }
}
