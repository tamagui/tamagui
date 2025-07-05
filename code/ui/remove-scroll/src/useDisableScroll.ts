import { useEffect } from 'react'

const canUseDOM = () =>
  typeof window !== 'undefined' && !!window.document && !!window.document.createElement

export const useDisableBodyScroll = (enabled: boolean): void => {
  useEffect(() => {
    if (!enabled || !canUseDOM()) {
      return
    }

    // for 99% browsers this can replace all the events
    const bodyEl = document.documentElement
    const previousBodyStyle = {
      scrollbarGutter: bodyEl.style.scrollbarGutter,
      overflow: bodyEl.style.overflow,
    }
    bodyEl.style.scrollbarGutter = 'stable'
    bodyEl.style.overflow = 'hidden'

    return () => {
      Object.assign(bodyEl.style, previousBodyStyle)
    }
  }, [enabled])
}
