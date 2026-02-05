import { useEffect, useRef } from 'react'
import type { ScrollView as RNScrollView } from 'react-native'
import type { ScrollBridge } from './types'

type GestureOwner = 'none' | 'pan' | 'scroll'

interface GestureState {
  startY: number
  lastY: number
  owner: GestureOwner
  panDragOffset: number
  dys: number[]
  scrollYAtGestureStart: number
}

interface UseSheetScrollViewGesturesProps {
  scrollRef: React.RefObject<RNScrollView | null>
  scrollBridge: ScrollBridge
  hasScrollableContent: boolean
  scrollEnabled: boolean
  setScrollEnabled: (enabled: boolean, lockTo?: number) => void
}

export function useSheetScrollViewGestures({
  scrollRef,
  scrollBridge,
  hasScrollableContent,
}: UseSheetScrollViewGesturesProps) {
  const state = useRef<GestureState>({
    startY: 0,
    lastY: 0,
    owner: 'none',
    panDragOffset: 0,
    dys: [],
    scrollYAtGestureStart: 0,
  })

  useEffect(() => {
    if (!scrollRef.current) return

    const controller = new AbortController()
    const node = scrollRef.current?.getScrollableNode() as HTMLElement | undefined

    if (!node) return

    node.style.overscrollBehavior = 'contain'

    // track original overflow to restore later
    let originalOverflow = ''

    const disableScroll = () => {
      if (node.style.overflowY !== 'hidden') {
        originalOverflow = node.style.overflowY
        node.style.overflowY = 'hidden'
      }
    }

    const enableScroll = () => {
      node.style.overflowY = originalOverflow
    }

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return

      const currentScrollY = node.scrollTop

      state.current = {
        startY: touch.pageY,
        lastY: touch.pageY,
        owner: 'none',
        panDragOffset: 0,
        dys: [],
        scrollYAtGestureStart: currentScrollY,
      }

      scrollBridge.scrollStartY = touch.pageY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return

      const { current: s } = state
      const pageY = touch.pageY
      const dy = pageY - s.lastY
      s.lastY = pageY

      if (dy === 0) return

      const isDraggingDown = dy > 0
      const currentScrollY = node.scrollTop
      const isPaneAtTop = scrollBridge.paneY <= scrollBridge.paneMinY + 5

      scrollBridge.y = currentScrollY

      // simple ownership rules:
      // - pan owns when: sheet not at top, OR (sheet at top AND scrollY=0 AND dragging down)
      // - scroll owns otherwise

      let shouldPanOwn = false

      if (!isPaneAtTop) {
        // sheet not at top - pan always owns
        shouldPanOwn = true
      } else if (currentScrollY <= 0 && isDraggingDown) {
        // at top, scroll at 0, dragging down - pan owns (pull sheet down)
        shouldPanOwn = true
      }

      const newOwner: GestureOwner = shouldPanOwn ? 'pan' : 'scroll'

      // handle transitions
      if (newOwner !== s.owner) {
        if (newOwner === 'pan') {
          s.panDragOffset = 0
          s.dys = []
          scrollBridge.setParentDragging(true)
          disableScroll()
        } else {
          scrollBridge.setParentDragging(false)
          scrollBridge.scrollLock = false
          enableScroll()
        }
        s.owner = newOwner
      }

      if (s.owner === 'pan') {
        if (e.cancelable) e.preventDefault()

        s.panDragOffset += dy
        scrollBridge.drag(s.panDragOffset)

        s.dys.push(dy)
        if (s.dys.length > 100) s.dys = s.dys.slice(-10)
      } else if (s.owner === 'scroll') {
        // programmatic scroll for synthetic events
        const scrollDelta = -dy
        const maxScrollY = node.scrollHeight - node.clientHeight
        const newScrollY = Math.max(0, Math.min(maxScrollY, currentScrollY + scrollDelta))
        if (newScrollY !== currentScrollY) {
          node.scrollTop = newScrollY
          scrollBridge.y = newScrollY
        }
      }
    }

    const handleTouchEnd = () => {
      const { current: s } = state

      if (s.owner === 'pan') {
        scrollBridge.setParentDragging(false)

        let vy = 0
        if (s.dys.length) {
          const recentDys = s.dys.slice(-10)
          const dist = recentDys.reduce((a, b) => a + b, 0)
          vy = (dist / recentDys.length) * 0.04
        }

        scrollBridge.release({ dragAt: s.panDragOffset, vy })
      }

      enableScroll()
      s.owner = 'none'
      s.panDragOffset = 0
      s.dys = []
    }

    node.addEventListener('touchstart', handleTouchStart, {
      signal: controller.signal,
      passive: true,
    })
    node.addEventListener('touchmove', handleTouchMove, {
      signal: controller.signal,
      passive: false,
    })
    node.addEventListener('touchend', handleTouchEnd, {
      signal: controller.signal,
      passive: true,
    })
    node.addEventListener('touchcancel', handleTouchEnd, {
      signal: controller.signal,
      passive: true,
    })

    return () => {
      enableScroll()
      controller.abort()
    }
  }, [scrollRef, scrollBridge, hasScrollableContent])

  return {}
}
