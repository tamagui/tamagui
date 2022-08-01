import React, { forwardRef, useRef, useState } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import { useSheetContext } from './SheetContext'
import { SheetScopedProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SheetScrollView
 * -----------------------------------------------------------------------------------------------*/

const SHEET_SCROLL_VIEW_NAME = 'SheetScrollView'

export const SheetScrollView = forwardRef<ScrollView, ScrollViewProps>(
  ({ __scopeSheet, ...props }: SheetScopedProps<ScrollViewProps>, ref) => {
    const { scrollBridge } = useSheetContext(SHEET_SCROLL_VIEW_NAME, __scopeSheet)
    const [scrollEnabled, setScrollEnabled] = useState(true)
    const state = useRef({
      lastPageY: 0,
      dragAt: 0,
      dys: [] as number[], // store a few recent dys to get velocity on release
    })

    const release = () => {
      setScrollEnabled(true)
      let vy = 0
      if (state.current.dys.length) {
        const recentDys = state.current.dys.slice(-10)
        const dist = recentDys.length ? recentDys.reduce((a, b) => a + b, 0) : 0
        const avgDy = dist / recentDys.length
        vy = avgDy * 0.04
        console.table([{ vy, avgDy, dist, recentDys }])
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
        onScrollBeginDrag={() => {
          console.log('begin drag')
        }}
        scrollEventThrottle={16}
        scrollEnabled={scrollEnabled}
        onScroll={(e) => {
          const { y } = e.nativeEvent.contentOffset
          scrollBridge.y = y
          if (y > 0) {
            scrollBridge.scrollStartY = -1
          }
        }}
        onResponderMove={(e) => {
          const { pageY } = e.nativeEvent
          if (scrollBridge.y === 0) {
            if (scrollBridge.scrollStartY === -1) {
              scrollBridge.scrollStartY = pageY
            }
            const dragAt = pageY - scrollBridge.scrollStartY
            const dy = pageY - state.current.lastPageY
            state.current.lastPageY = pageY // after dy
            state.current.dy = dy
            if (dragAt <= 0) {
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
          }
        }}
        onResponderRelease={release}
        // todo release we can just grab the last dY and estimate vY using a sample of last dYs
        {...props}
        style={[
          {
            flex: 1,
          },
          props.style,
        ]}
      />
    )
  }
)
