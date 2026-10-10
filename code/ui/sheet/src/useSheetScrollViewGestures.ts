import type { ScrollViewRef } from '@tamagui/scroll-view'
import { useEffect, useRef } from 'react'
import type { ScrollBridge } from './types'

type GestureOwner = 'none' | 'pan' | 'scroll'

interface GestureState {
  startY: number
  lastY: number
  owner: GestureOwner
  hadPanOwner: boolean
  panDragOffset: number
  dys: number[]
  scrollYAtGestureStart: number
}

interface UseSheetScrollViewGesturesProps {
  scrollRef: React.RefObject<ScrollViewRef | null>
  scrollBridge: ScrollBridge
  hasScrollableContent: boolean
  scrollEnabled: boolean
  setScrollEnabled: (enabled: boolean, lockTo?: number) => void
  onManualScroll?: (node: HTMLElement, y: number) => void
}

export function useSheetScrollViewGestures({
  scrollRef,
  scrollBridge,
  hasScrollableContent,
  onManualScroll,
}: UseSheetScrollViewGesturesProps) {
  const state = useRef<GestureState>({
    startY: 0,
    lastY: 0,
    owner: 'none',
    hadPanOwner: false,
    panDragOffset: 0,
    dys: [],
    scrollYAtGestureStart: 0,
  })
  const onManualScrollRef = useRef(onManualScroll)

  useEffect(() => {
    onManualScrollRef.current = onManualScroll
  }, [onManualScroll])

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

    const setScrollTop = (nextScrollY: number) => {
      if (node.scrollTop === nextScrollY) return

      node.scrollTop = nextScrollY
      onManualScrollRef.current?.(node, nextScrollY)
    }

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return

      const currentScrollY = node.scrollTop

      state.current = {
        startY: touch.pageY,
        lastY: touch.pageY,
        owner: 'none',
        hadPanOwner: false,
        panDragOffset: 0,
        dys: [],
        scrollYAtGestureStart: currentScrollY,
      }

      scrollBridge.scrollStartY = touch.pageY
      // claim this touch for the scroll-view gesture hook so the PanResponder
      // (which also negotiates this touch via RNW's responder system) defers
      // and doesn't double-drive the sheet position. cleared on touchend.
      scrollBridge.scrollNodeTouched = true
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
      const isPaneAtTop =
        scrollBridge.isAtTop ?? scrollBridge.paneY <= scrollBridge.paneMinY + 5

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
          s.hadPanOwner = true
          s.panDragOffset = 0
          s.dys = []
          // re-baseline the pan origin to the sheet's CURRENT position so the
          // offset (reset to 0 here) maps to where it actually is — required for
          // a correct scroll→pan handoff now that the PanResponder defers to us.
          scrollBridge.startPanDrag?.()
          scrollBridge.setParentDragging(true)
          disableScroll()
        } else {
          scrollBridge.setParentDragging(false)
          scrollBridge.scrollLock = false
          if (s.hadPanOwner) {
            disableScroll()
          } else {
            enableScroll()
          }
        }
        s.owner = newOwner
      }

      if (s.owner === 'pan') {
        if (e.cancelable) e.preventDefault()

        s.panDragOffset += dy
        scrollBridge.drag(s.panDragOffset)

        s.dys.push(dy)
        if (s.dys.length > 100) s.dys = s.dys.slice(-10)
      } else if (s.owner === 'scroll' && (!e.isTrusted || s.hadPanOwner)) {
        // synthetic events don't trigger native overflow scroll, so tests need us
        // to move scrollTop directly. real mixed gestures need the same direct
        // path after pan ownership: ios safari may not resume native scrolling
        // mid-touch after an earlier prevented touchmove. pure real scrolls still
        // use native scrolling; mixed pan↔scroll gestures keep overflow hidden
        // and are driven here until touchend.
        if (e.cancelable) e.preventDefault()
        const scrollDelta = -dy
        const maxScrollY = node.scrollHeight - node.clientHeight
        const newScrollY = Math.max(0, Math.min(maxScrollY, currentScrollY + scrollDelta))
        if (newScrollY !== currentScrollY) {
          setScrollTop(newScrollY)
          scrollBridge.y = newScrollY
          if (newScrollY > 0) scrollBridge.scrollStartY = -1
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
      } else if (s.owner === 'scroll') {
        // gesture ended while scrolling. a pan→scroll handoff only happens once
        // the pane reached the top, so commit the top snap (index 0) and clear
        // the dragging state HERE, on touchend — never mid-gesture (that would
        // fight the live gesture). this replaces the PanResponder's release,
        // which used to fire on touchend before it deferred to this hook.
        scrollBridge.snapToPosition?.(0)
      }

      enableScroll()
      s.owner = 'none'
      s.hadPanOwner = false
      s.panDragOffset = 0
      s.dys = []
      scrollBridge.scrollNodeTouched = false
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
