import { useComposedRefs } from '@tamagui/compose-refs'
import { GestureReponderEvent, composeEventHandlers } from '@tamagui/core'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, ScrollViewProps } from 'react-native'

import { useSheetContext } from './SheetContext'
import { SheetScopedProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SheetScrollView
 * -----------------------------------------------------------------------------------------------*/

const SHEET_SCROLL_VIEW_NAME = 'SheetScrollView'

export const SheetScrollView = forwardRef<ScrollView, ScrollViewProps>(
  ({ __scopeSheet, ...props }: SheetScopedProps<ScrollViewProps>, forwardedRef) => {
    const ref = useRef<ScrollView>(null)
    const composedRef = useComposedRefs(ref, forwardedRef)
    const { scrollBridge } = useSheetContext(SHEET_SCROLL_VIEW_NAME, __scopeSheet)
    const [scrollEnabled, setScrollEnabled_] = useState(true)
    const setScrollEnabled = (next: boolean) => {
      setScrollEnabled_(next)
      // scrollBridge.scrollLock = !next
    }
    const state = useRef({
      lastPageY: 0,
      dy: 0,
      // store a few recent dys to get velocity on release
      dys: [] as number[],
    })

    const release = () => {
      const recentDys = state.current.dys.slice(-10)
      const dist = recentDys.length ? recentDys.reduce((a, b) => a + b, 0) : 0
      const avgDy = dist / recentDys.length
      const vy = avgDy * 0.08
      state.current.dys = []
      scrollBridge.release({
        dy: state.current.dy,
        vy,
      })
      // if we do it next frame when you drag up and release from mid-point it enables
      // scroll too soon, and somehow the scroll pane (mobile web) will catch the released
      // drag and scroll when it shouldn't.
      setTimeout(() => {
        setScrollEnabled(true)
      }, 16)
    }

    useEffect(() => {
      scrollBridge.enabled = true
      return () => {
        scrollBridge.enabled = false
      }
    }, [scrollBridge])

    const shouldDrag = (e: GestureReponderEvent) => {
      const { pageY } = e.nativeEvent

      // scrolling up
      const isPaneAtTop = scrollBridge.paneY <= scrollBridge.paneMinY
      if (isPaneAtTop) {
        setScrollEnabled(true)
        return false
      }

      // scrolling down
      const isScrollAtTop = scrollBridge.y <= 0
      const { scrollLock } = scrollBridge
      const shouldDrag = isScrollAtTop || !isPaneAtTop || scrollLock

      if (!shouldDrag) {
        return false
      }

      const dy = pageY - scrollBridge.scrollStartY
      if (!isPaneAtTop && isScrollAtTop && dy <= 0) {
        setScrollEnabled(true)
        return false
      }
      if (isScrollAtTop) {
        if (dy <= 0) {
          setScrollEnabled(true)
          return false
        }
      }

      // quicker scroll disable on up
      // works at disabling the extra scrolltop move on quick up drags,
      //  but then the scroll doesnt continue :/
      // Object.assign(ref.current.style, {
      //   overflowY: 'hidden',
      // })

      return true
    }

    return (
      <ScrollView
        ref={composedRef}
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
          scrollBridge.scrollStartY = -1
          scrollBridge.scrollLock = false
          console.warn('😜😜😜😜😜😜😜😜😜😜😜 end responder')
        }}
        onMoveShouldSetResponderCapture={shouldDrag}
        onResponderMove={composeEventHandlers(props.onResponderMove, (e) => {
          const { pageY } = e.nativeEvent

          if (scrollBridge.scrollStartY === -1) {
            console.warn('⚠️ set scroll start', pageY)
            scrollBridge.scrollStartY = pageY
            state.current.lastPageY = pageY
          }

          // scrolling up
          const isPaneAtTop = scrollBridge.paneY <= scrollBridge.paneMinY
          if (isPaneAtTop) {
            setScrollEnabled(true)
          }

          // scrolling down
          const isScrollAtTop = scrollBridge.y <= 0
          const { scrollLock } = scrollBridge
          const shouldDrag = isScrollAtTop || !isPaneAtTop || scrollLock
          const dragTo = pageY - scrollBridge.scrollStartY

          const dy = pageY - state.current.lastPageY

          state.current.lastPageY = pageY

          console.log('dragTo', Math.round(dragTo), 'dy', Math.round(dy))

          const isDragAboveStart = dragTo <= 0
          const isDraggingUp = dy < 0
          const isDraggingDown = dy > 0

          // console.warn(
          //   'shouldDrag',
          //   { shouldDrag, scrollLock, isPaneAtTop, isScrollAtTop },
          //   scrollBridge.y
          // )

          if (scrollLock && isPaneAtTop && isDragAboveStart) {
            console.log('bail - scrolled tot op draging up')
            return
          }

          if (shouldDrag) {
            // if (isPaneAtTop && isScrollAtTop && isDragAboveStart) {
            //   console.error('2')
            //   setScrollEnabled(true)
            //   return
            // }
            // if (isScrollAtTop) {
            //   if (dragTo <= 0) {
            //     console.error('3')
            //     setScrollEnabled(true)
            //     return
            //   }
            // }
            console.log('▲ scroll drag', dragTo)
            scrollBridge.scrollLock = true
            setScrollEnabled(false)
            scrollBridge.drag(dragTo)
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
