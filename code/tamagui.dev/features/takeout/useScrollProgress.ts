import { useEffect, useState } from 'react'
import { isClient } from 'tamagui'

export const heroHeight = 1050

export const HERO_SCROLL_END = 150
export const SECTION_TITLE_SCROLL_START = heroHeight - 100
export const SECTION_TITLE_SCROLL_END = heroHeight + 600
export const WEB_FRAME_SCROLL_START = 100
export const WEB_FRAME_SCROLL_END = 300
export const PHONE_FRAME_SCROLL_START = 400
export const PHONE_FRAME_SCROLL_END = 600
export const VERSION_SCROLL_START = 700
export const VERSION_SCROLL_END = 900

export const useScrollProgress = (start = 0, end = 150) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isClient) return

    let rafId: number | null = null
    let lastProgress = 0

    const handleScroll = () => {
      if (rafId) return

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const newProgress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)))
        if (Math.abs(newProgress - lastProgress) > 0.001) {
          lastProgress = newProgress
          setProgress(newProgress)
        }
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [start, end])

  return progress
}

export const useScrollPosition = (offset = 0) => {
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      const sy = document.documentElement?.scrollTop ?? 0
      setScrollTop(sy + offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])

  return scrollTop
}
