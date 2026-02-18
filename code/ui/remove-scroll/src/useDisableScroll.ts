import { useEffect, useRef } from 'react'

const canUseDOM = () =>
  typeof window !== 'undefined' && !!window.document && !!window.document.createElement

let refCount = 0
let savedScrollY = 0
let previousStyles: {
  htmlOverflow: string
  htmlScrollbarGutter: string
  bodyPosition: string
  bodyTop: string
  bodyWidth: string
  bodyOverflow: string
  bodyOverscrollBehavior: string
} | null = null

// detect iOS Safari which needs position:fixed workaround
function isIOSSafari() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
  return isIOS && isSafari
}

export const useDisableBodyScroll = (enabled: boolean): void => {
  const wasEnabled = useRef(false)

  useEffect(() => {
    if (!canUseDOM()) {
      return
    }

    if (enabled && !wasEnabled.current) {
      wasEnabled.current = true

      if (++refCount === 1) {
        const html = document.documentElement
        const body = document.body

        // save current scroll position before locking
        savedScrollY = window.scrollY

        // save previous styles
        previousStyles = {
          htmlOverflow: html.style.overflow,
          htmlScrollbarGutter: html.style.scrollbarGutter,
          bodyPosition: body.style.position,
          bodyTop: body.style.top,
          bodyWidth: body.style.width,
          bodyOverflow: body.style.overflow,
          bodyOverscrollBehavior: body.style.overscrollBehavior,
        }

        // apply scroll lock styles
        html.style.scrollbarGutter = 'stable'
        html.style.overflow = 'hidden'

        // prevent scroll chaining on all browsers
        body.style.overscrollBehavior = 'none'

        // for iOS Safari, use position:fixed workaround
        // this also helps with any edge cases on other mobile browsers
        if (isIOSSafari()) {
          body.style.position = 'fixed'
          body.style.top = `-${savedScrollY}px`
          body.style.width = '100%'
          body.style.overflow = 'hidden'
        }
      }
    } else if (!enabled && wasEnabled.current) {
      wasEnabled.current = false

      if (--refCount === 0 && previousStyles) {
        const html = document.documentElement
        const body = document.body

        // restore previous styles
        html.style.overflow = previousStyles.htmlOverflow
        html.style.scrollbarGutter = previousStyles.htmlScrollbarGutter
        body.style.position = previousStyles.bodyPosition
        body.style.top = previousStyles.bodyTop
        body.style.width = previousStyles.bodyWidth
        body.style.overflow = previousStyles.bodyOverflow
        body.style.overscrollBehavior = previousStyles.bodyOverscrollBehavior

        // restore scroll position (browsers reset to 0 when overflow:hidden is removed)
        if (savedScrollY > 0) {
          window.scrollTo(0, savedScrollY)
        }

        previousStyles = null
        savedScrollY = 0
      }
    }
  }, [enabled])

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (wasEnabled.current) {
        wasEnabled.current = false
        if (--refCount === 0 && previousStyles) {
          const html = document.documentElement
          const body = document.body

          html.style.overflow = previousStyles.htmlOverflow
          html.style.scrollbarGutter = previousStyles.htmlScrollbarGutter
          body.style.position = previousStyles.bodyPosition
          body.style.top = previousStyles.bodyTop
          body.style.width = previousStyles.bodyWidth
          body.style.overflow = previousStyles.bodyOverflow
          body.style.overscrollBehavior = previousStyles.bodyOverscrollBehavior

          if (savedScrollY > 0) {
            window.scrollTo(0, savedScrollY)
          }

          previousStyles = null
          savedScrollY = 0
        }
      }
    }
  }, [])
}
