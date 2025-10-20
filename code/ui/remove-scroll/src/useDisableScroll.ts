import { useEffect } from 'react'

const canUseDOM = () =>
  typeof window !== 'undefined' && !!window.document && !!window.document.createElement

let refCount = 0
let previousBodyStyle: { scrollbarGutter: string; overflow: string } | null = null

export const useDisableBodyScroll = (enabled: boolean): void => {
  useEffect(() => {
    if (!enabled || !canUseDOM()) {
      return
    }

    // for 99% browsers this can replace all the events
    const bodyEl = document.documentElement

    if (++refCount === 1) {
      previousBodyStyle = {
        scrollbarGutter: bodyEl.style.scrollbarGutter,
        overflow: bodyEl.style.overflow,
      }
      bodyEl.style.scrollbarGutter = 'stable'
      bodyEl.style.overflow = 'hidden'
    }

    return () => {
      if (--refCount === 0 && previousBodyStyle) {
        Object.assign(bodyEl.style, previousBodyStyle)
        previousBodyStyle = null
      }
    }
  }, [enabled])
}
