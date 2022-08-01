import { composeEventHandlers } from '@tamagui/core'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, ScrollViewProps } from 'react-native'

import { useSheetContext } from './SheetContext'
import { SheetScopedProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SheetScrollView
 * -----------------------------------------------------------------------------------------------*/

const SHEET_SCROLL_VIEW_NAME = 'SheetScrollView'

export const SheetScrollView = forwardRef<ScrollView, ScrollViewProps>(
  ({ __scopeSheet, ...props }: SheetScopedProps<ScrollViewProps>, ref) => {
    const { scrollBridge } = useSheetContext(SHEET_SCROLL_VIEW_NAME, __scopeSheet)
    const [scrollEnabled, setScrollEnabled_] = useState(true)
    const setScrollEnabled = (next: boolean) => {
      console.groupCollapsed('setScrollEnabled', next)
      console.trace()
      console.groupEnd()
      setScrollEnabled_(next)
      scrollBridge.scrollLock = !next
    }
    const state = useRef({
      dy: 0,
      // store a few recent dys to get velocity on release
      dys: [] as number[],
    })

    const release = () => {
      const recentDys = state.current.dys.slice(-10)
      const dist = recentDys.length
        ? recentDys.reduce((a, b, i) => a + b - (recentDys[i - 1] ?? recentDys[0]), 0)
        : 0
      const avgDy = dist / recentDys.length
      const vy = avgDy * 0.075
      state.current.dys = []
      scrollBridge.release({
        dy: state.current.dy,
        vy,
      })
      setTimeout(() => {
        // scrollBridge.onFinishAnimate = () => {
        setScrollEnabled(true)
        // }
      }, 20)
    }

    useEffect(() => {
      scrollBridge.enabled = true
      return () => {
        scrollBridge.enabled = false
      }
    }, [scrollBridge])

    return (
      <ScrollView
        ref={ref}
        scrollEventThrottle={8} // todo release we can just grab the last dY and estimate vY using a sample of last dYs
        {...props}
        scrollEnabled={props.scrollEnabled ?? scrollEnabled}
        onScroll={composeEventHandlers<NativeSyntheticEvent<NativeScrollEvent>>(
          props.onScroll,
          (e) => {
            console.log('🔸')
            const { y } = e.nativeEvent.contentOffset
            scrollBridge.y = y
            if (y > 0 && !scrollBridge.scrollLock) {
              console.error('reset scroll start')
              scrollBridge.scrollStartY = -1
            }
          }
        )}
        onResponderEnd={() => {
          console.error('repond end')
          scrollBridge.scrollStartY = -1
          scrollBridge.scrollLock = false
        }}
        // onResponderGrant={() => {
        //   scrollBridge.scrollLock = true
        // }}
        onResponderMove={composeEventHandlers(props.onResponderMove, (e) => {
          const { pageY } = e.nativeEvent

          if (scrollBridge.scrollStartY === -1) {
            console.warn('⚠️ set', pageY)
            scrollBridge.scrollStartY = pageY
          }

          // scrolling up
          const isPaneAtTop = scrollBridge.paneY <= scrollBridge.paneMinY
          if (isPaneAtTop) {
            console.error('1')
            setScrollEnabled(true)
          }

          // scrolling down
          const isScrollAtTop = scrollBridge.y <= 0
          const { scrollLock } = scrollBridge
          const shouldDrag = isScrollAtTop || !isPaneAtTop || scrollLock

          console.warn(
            'shouldDrag',
            { shouldDrag, scrollLock, isPaneAtTop, isScrollAtTop },
            scrollBridge.y
          )

          if (shouldDrag) {
            const dy = pageY - scrollBridge.scrollStartY
            console.log('dy', dy)
            if (!isPaneAtTop && isScrollAtTop && dy <= 0) {
              console.error('2')
              setScrollEnabled(true)
              return
            }
            if (isScrollAtTop) {
              if (dy <= 0) {
                console.error('3')
                setScrollEnabled(true)
                return
              }
            }
            console.log('▲ scroll drag', dy)
            setScrollEnabled(false)
            scrollBridge.drag(dy)
            state.current.dy = dy
            state.current.dys.push(dy)
            // only do every so often, cut down to 10 again
            if (state.current.dys.length > 100) {
              state.current.dys = state.current.dys.slice(-10)
            }
          }
        })}
        onResponderReject={composeEventHandlers(props.onResponderReject, release)}
        onResponderTerminate={composeEventHandlers(props.onResponderTerminate, release)}
        onResponderRelease={composeEventHandlers(props.onResponderRelease, release)}
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
