import { TamaguiElement } from '@tamagui/core'
import { ScrollView, ScrollViewProps } from '@tamagui/scroll-view'
import { forwardRef, useRef, useState } from 'react'

import { useSheetContext } from './SheetContext'
import { SheetScopedProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SheetScrollView
 * -----------------------------------------------------------------------------------------------*/

const SHEET_SCROLL_VIEW_NAME = 'SheetScrollView'

export const SheetScrollView = forwardRef<TamaguiElement, ScrollViewProps>(
  ({ __scopeSheet, ...props }: SheetScopedProps<ScrollViewProps>, ref) => {
    const { scrollBridge } = useSheetContext(SHEET_SCROLL_VIEW_NAME, __scopeSheet)
    const [scrollEnabled, setScrollEnabled] = useState(true)
    const state = useRef({
      lastPageY: 0,
      dragAt: 0,
      dys: [] as number[], // store a few recent dys to get velocity on release
      isScrolling: false,
    })

    const release = () => {
      scrollBridge.scrollStartY = -1
      state.current.isScrolling = false
      setScrollEnabled(true)
      let vy = 0
      if (state.current.dys.length) {
        const recentDys = state.current.dys.slice(-10)
        const dist = recentDys.length ? recentDys.reduce((a, b) => a + b, 0) : 0
        const avgDy = dist / recentDys.length
        vy = avgDy * 0.04
      }
      state.current.dys = []
      scrollBridge.release({
        dragAt: state.current.dragAt,
        vy,
      })
    }

    return (
      <ScrollView
        ref={ref}
        flex={1}
        scrollEventThrottle={8}
        scrollEnabled={scrollEnabled}
        onScroll={(e) => {
          const { y } = e.nativeEvent.contentOffset
          scrollBridge.y = y
          if (y > 0) {
            scrollBridge.scrollStartY = -1
          }
        }}
        onStartShouldSetResponder={() => {
          scrollBridge.scrollStartY = -1
          return true
        }}
        onMoveShouldSetResponder={() => true}
        onResponderMove={(e) => {
          const { pageY } = e.nativeEvent

          if (state.current.isScrolling) {
            return
          }

          if (scrollBridge.scrollStartY === -1) {
            scrollBridge.scrollStartY = pageY
            state.current.lastPageY = pageY
          }

          const dragAt = pageY - scrollBridge.scrollStartY
          const dy = pageY - state.current.lastPageY
          state.current.lastPageY = pageY // after dy
          // const isAboveStart = dragAt <= 0
          // const isDraggingDown = dy > 0
          // const isScrollAtTop = scrollBridge.y <= 0
          const isDraggingUp = dy < 0
          const isPaneAtTop = scrollBridge.paneY <= scrollBridge.paneMinY

          if ((dy === 0 || isDraggingUp) && isPaneAtTop) {
            state.current.isScrolling = true
            setScrollEnabled(true)
            return
          }

          setScrollEnabled(false)
          scrollBridge.drag(dragAt)
          state.current.dragAt = dragAt
          state.current.dys.push(dy)
          // only do every so often, cut down to 10 again
          if (state.current.dys.length > 100) {
            state.current.dys = state.current.dys.slice(-10)
          }
        }}
        onResponderRelease={release}
        // onResponderEnd={release}
        // onResponderTerminate={release}
        {...props}
      />
    )
  }
)
