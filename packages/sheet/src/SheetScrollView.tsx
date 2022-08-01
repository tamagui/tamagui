import { useComposedRefs } from '@tamagui/compose-refs'
import { GestureReponderEvent, composeEventHandlers, isWeb } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { useSheetContext } from './SheetContext'
import { SheetScopedProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SheetScrollView
 * -----------------------------------------------------------------------------------------------*/

const SHEET_SCROLL_VIEW_NAME = 'SheetScrollView'
let i

export const SheetScrollView = forwardRef<ScrollView, ScrollViewProps>(
  ({ __scopeSheet, ...props }: SheetScopedProps<ScrollViewProps>, forwardedRef) => {
    const ref = useRef<ScrollView>(null)
    const composedRef = useComposedRefs(ref, forwardedRef)
    const { scrollBridge } = useSheetContext(SHEET_SCROLL_VIEW_NAME, __scopeSheet)
    const [scrollEnabled, setScrollEnabled_] = useState(true)
    const setScrollEnabled = (enabled: boolean, dragAt?: number) => {
      if (!isWeb) {
        const isDraggingDown = state.current.dy > 0
        const translateY = !enabled && dragAt ? (isDraggingDown ? -dragAt / 2 : -dragAt) : 0
        console.warn('translateY', translateY, state.current.dy, isDraggingDown, enabled, dragAt)
        innerRef.current!.setNativeProps({
          style: { transform: [{ translateY }] },
        })
        // ref.current?.setNativeProps({ scrollEnabled: enabled })
      } else {
        setScrollEnabled_((prev) => {
          if (prev !== enabled) {
            console.groupCollapsed('set scroll enabled', enabled)
            console.trace()
            console.groupEnd()
          }
          return enabled
        })
      }
      // scrollBridge.scrollLock = !next
    }
    const state = useRef({
      lockScrollY: null as number | null,
      lastPageY: 0,
      dy: 0,
      dragAt: 0,
      // store a few recent dys to get velocity on release
      dys: [] as number[],
    })

    const release = () => {
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
      // if we do it next frame when you drag up and release from mid-point it enables
      // scroll too soon, and somehow the scroll pane (mobile web) will catch the released
      // drag and scroll when it shouldn't.
      setTimeout(() => {
        setScrollEnabled(true)
      })
    }

    useEffect(() => {
      scrollBridge.enabled = true
      return () => {
        scrollBridge.enabled = false
      }
    }, [scrollBridge])

    // const shouldDrag = (e: GestureReponderEvent) => {
    //   const { pageY } = e.nativeEvent

    //   // scrolling up
    //   const isPaneAtTop = scrollBridge.paneY <= scrollBridge.paneMinY
    //   if (isPaneAtTop) {
    //     setScrollEnabled(true)
    //     return false
    //   }

    //   // scrolling down
    //   const isScrollAtTop = scrollBridge.y <= 0
    //   const { scrollLock } = scrollBridge
    //   const shouldDrag = isScrollAtTop || !isPaneAtTop || scrollLock

    //   if (!shouldDrag) {
    //     return false
    //   }

    //   const dy = pageY - scrollBridge.scrollStartY
    //   if (!isPaneAtTop && isScrollAtTop && dy <= 0) {
    //     setScrollEnabled(true)
    //     return false
    //   }
    //   if (isScrollAtTop) {
    //     if (dy <= 0) {
    //       setScrollEnabled(true)
    //       return false
    //     }
    //   }

    //   // quicker scroll disable on up
    //   // works at disabling the extra scrolltop move on quick up drags,
    //   //  but then the scroll doesnt continue :/
    //   // Object.assign(ref.current.style, {
    //   //   overflowY: 'hidden',
    //   // })

    //   return true
    // }

    console.log('scrollEnabled', scrollEnabled)

    // if (isSafari) {
    //   useLayoutEffect(() => {
    //     const l = (e: Event) => {
    //       console.log('123', scrollEnabled)
    //       if (scrollEnabled) {
    //         return
    //       }
    //       e.stopImmediatePropagation()
    //       e.preventDefault()
    //       ref.current.scrollTop = 0
    //       return false
    //     }
    //     ref.current.addEventListener('wheel', l)
    //     ref.current.addEventListener('scroll', l)
    //     return () => {
    //       ref.current.removeEventListener('wheel', l)
    //       ref.current.removeEventListener('scroll', l)
    //     }
    //   }, [scrollEnabled])
    // }

    const enabled = props.scrollEnabled ?? scrollEnabled
    console.log('enabled', enabled, -scrollBridge.y)

    const innerRef = useRef<any>()
    return (
      <ScrollView
        ref={composedRef}
        shouldCancelWhenOutside={false}
        scrollEventThrottle={8} // todo release we can just grab the last dY and estimate vY using a sample of last dYs
        showsVerticalScrollIndicator={false}
        scrollEnabled
        onScroll={composeEventHandlers<NativeSyntheticEvent<NativeScrollEvent>>(
          props.onScroll,
          (e) => {
            const { y } = e.nativeEvent.contentOffset
            console.log('🔸', y)
            scrollBridge.y = y
            // if (y > 0 && !scrollBridge.scrollLock) {
            //   console.error('reset scroll start')
            //   scrollBridge.scrollStartY = -1
            // }
          }
        )}
        // onResponderTerminationRequest={() => false}
        onResponderEnd={() => {
          scrollBridge.scrollStartY = -1
          scrollBridge.scrollLock = false
          console.warn('😜😜😜😜😜😜😜😜😜😜😜 end responder')
        }}
        onMoveShouldSetResponder={() => true}
        // onMoveShouldSetResponderCapture={() => true}
        onResponderMove={composeEventHandlers(props.onResponderMove, (e) => {
          const { pageY } = e.nativeEvent

          console.log('move')

          if (scrollBridge.scrollStartY === -1) {
            console.warn('⚠️ set scroll start', pageY)
            scrollBridge.scrollStartY = pageY
            state.current.lastPageY = pageY
          }

          const dragAt = pageY - scrollBridge.scrollStartY
          const dy = pageY - state.current.lastPageY
          state.current.lastPageY = pageY // after dy
          state.current.dy = dy
          const isAboveStart = dragAt <= 0
          const isDraggingUp = dy < 0
          const isDraggingDown = dy > 0

          // scrolling up
          const isPaneAtTop = scrollBridge.paneY <= scrollBridge.paneMinY
          if (isPaneAtTop && !isDraggingDown) {
            setScrollEnabled(true)
          }
          if (isDraggingDown) {
            scrollBridge.scrollLock = false
          }
          if (isDraggingUp && isPaneAtTop) {
            scrollBridge.scrollLock = false
          }

          // scrolling down
          const isScrollAtTop = scrollBridge.y <= 0
          const { scrollLock } = scrollBridge

          // console.table([
          //   {
          //     scrollLock,
          //     isPaneAtTop,
          //     isAboveStart,
          //     isScrollAtTop,
          //     dy,
          //     dragAt,
          //     isDraggingUp,
          //     sy: scrollBridge.y,
          //   },
          // ])

          if (scrollLock && isPaneAtTop && isAboveStart) {
            console.warn('bail1')
            setScrollEnabled(true)
            return
          }
          if (isPaneAtTop && (isDraggingUp || dy === 0)) {
            console.warn('bail2')
            setScrollEnabled(true)
            // ref.current?.setNativeProps({{ scrollEnabled: true }})
            return
          }

          if (isScrollAtTop || !isPaneAtTop || scrollLock) {
            scrollBridge.scrollLock = true
            console.warn('DRAG FROM SCROLL', dragAt, dy)
            setScrollEnabled(false, dragAt)
            scrollBridge.drag(dragAt)
            state.current.dragAt = dragAt
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
        // overScrollMode="never"
        // cancelsTouchesInView
        style={[
          {
            flex: 1,
          },
          props.style,
        ]}
        {...props}
      >
        <YStack flex={1} ref={innerRef}>
          {props.children}
        </YStack>
      </ScrollView>
    )
  }
)

export const isSafari = (() => {
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent?.toLowerCase() ?? ''
    return ua.includes('safari') && !ua.includes('chrome')
  }
  return false
})()
