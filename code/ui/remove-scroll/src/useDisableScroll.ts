import { useEffect, useRef } from 'react'

const canUseDOM = () =>
  typeof window !== 'undefined' && !!window.document && !!window.document.createElement

const preventDefault = (e: WheelEvent | TouchEvent | KeyboardEvent) => {
  if (e.preventDefault) {
    e.preventDefault()
  }
}

export const useDisableScrollOutsideOf = (
  nodeRef: React.RefObject<HTMLElement | null>,
  options: {
    enabled?: boolean
    // space: 32, page up: 33, page down: 34, end: 35, home: 36
    // left: 37, up: 38, right: 39, down: 40
    keyboardKeys?: number[]
  } = {}
) => {
  const { enabled, keyboardKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40] } = options

  useEffect(() => {
    if (!enabled || !canUseDOM()) {
      return
    }

    const node = nodeRef.current
    if (!node) {
      return
    }

    const scrollEl = document.scrollingElement
    if (!scrollEl || !(scrollEl instanceof HTMLElement)) {
      return
    }

    const previously = scrollEl.style.pointerEvents
    scrollEl.style.pointerEvents = 'none'

    const lockToScrollPos = [scrollEl.scrollLeft, scrollEl.scrollTop]

    const handleScroll = (e: Event) => {
      if (scrollEl) {
        e.preventDefault()
        scrollEl.scrollTo(lockToScrollPos[0], lockToScrollPos[1])
      }
    }

    const handleEvent = (e: WheelEvent | TouchEvent | KeyboardEvent) => {
      if (e.target instanceof Node && (e.target === node || node.contains(e.target))) {
        return
      }

      if ('keyCode' in e && !keyboardKeys.includes(e.keyCode)) {
        return
      }

      preventDefault(e)
    }

    document.addEventListener('scroll', handleScroll, { passive: false })
    document.addEventListener('wheel', handleEvent, { passive: false })
    document.addEventListener('touchmove', handleEvent, { passive: false })
    document.addEventListener('keydown', handleEvent, { passive: false })

    return () => {
      scrollEl.style.pointerEvents = previously
      document.removeEventListener('scroll', handleScroll)
      document.removeEventListener('wheel', handleEvent)
      document.removeEventListener('touchmove', handleEvent)
      document.removeEventListener('keydown', handleEvent)
    }
  }, [enabled, nodeRef, keyboardKeys])
}
