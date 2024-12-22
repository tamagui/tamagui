import React from 'react'
import { composeRefs } from '@tamagui/compose-refs'
import type { GetRef } from '@tamagui/core'
import type { ScrollViewProps } from '@tamagui/scroll-view'
import { ScrollView } from '@tamagui/scroll-view'

import type { ScrollView as RNScrollView } from 'react-native'

import { useSheetContext } from './SheetContext'
import type { SheetScopedProps } from './types'

// TODO ideally would replicate https://github.com/ammarahm-ed/react-native-actions-sheet/blob/master/src/index.tsx

/* -------------------------------------------------------------------------------------------------
 * SheetScrollView
 * -----------------------------------------------------------------------------------------------*/

const SHEET_SCROLL_VIEW_NAME = 'SheetScrollView'

export const SheetScrollView = React.forwardRef<
  GetRef<typeof ScrollView>,
  ScrollViewProps
>(
  (
    { __scopeSheet, children, onScroll, ...props }: SheetScopedProps<ScrollViewProps>,
    ref
  ) => {
    const context = useSheetContext(SHEET_SCROLL_VIEW_NAME, __scopeSheet)
    const { scrollBridge } = context
    // const [scrollEnabled, setScrollEnabled_] = useState(true)
    const scrollRef = React.useRef<RNScrollView | null>(null)

    // could make it so it has negative bottom margin and then pads the bottom content
    // to avoid clipping effect when resizing smaller
    // or more ideally could use context to register if it has a scrollview and change behavior
    // const offscreenSize = useSheetOffscreenSize(context)

    // const setScrollEnabled = (next: boolean) => {
    //   scrollRef.current?.setNativeProps?.({
    //     scrollEnabled: next,
    //   })
    //   setScrollEnabled_(next)
    // }

    const state = React.useRef({
      lastPageY: 0,
      dragAt: 0,
      dys: [] as number[], // store a few recent dys to get velocity on release
      isScrolling: false,
      isDragging: false,
    })

    const release = () => {
      if (!state.current.isDragging) {
        return
      }
      state.current.isDragging = false
      scrollBridge.scrollStartY = -1
      state.current.isScrolling = false
      // setScrollEnabled(true)
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
        ref={composeRefs(scrollRef as any, ref)}
        flex={1}
        scrollEventThrottle={8}
        onResponderRelease={release}
        className="_ovs-contain"
        // scrollEnabled={scrollEnabled}
        onScroll={(e) => {
          const { y } = e.nativeEvent.contentOffset
          scrollBridge.y = y
          if (y > 0) {
            scrollBridge.scrollStartY = -1
          }

          // Process the "onScroll" prop here if any
          onScroll?.(e)

          // This assures that we do not skip the "scrollBridge" values processing
          // when passing this prop into a <Sheet.ScrollView /> overriding it here

          // Useful when using this ScrollView with lists such as "FlashList", i.e.
          // ```
          // renderScrollComponent={Sheet.ScrollView}
          // ```
        }}
        onStartShouldSetResponder={() => {
          scrollBridge.scrollStartY = -1
          state.current.isDragging = true
          return true
        }}
        // setting to false while onResponderMove is disabled
        onMoveShouldSetResponder={() => false}
        // somehow disabling works better, regression, no more nice drag continue scroll
        // onResponderMove={(e) => {
        //   const { pageY } = e.nativeEvent

        //   if (state.current.isScrolling) {
        //     return
        //   }

        //   if (scrollBridge.scrollStartY === -1) {
        //     scrollBridge.scrollStartY = pageY
        //     state.current.lastPageY = pageY
        //   }

        //   const dragAt = pageY - scrollBridge.scrollStartY
        //   const dy = pageY - state.current.lastPageY
        //   state.current.lastPageY = pageY // after dy
        //   const isDraggingUp = dy < 0
        //   const isPaneAtTop = scrollBridge.paneY <= scrollBridge.paneMinY

        //   if ((dy === 0 || isDraggingUp) && isPaneAtTop) {
        //     state.current.isScrolling = true
        //     setScrollEnabled(true)
        //     return
        //   }

        //   setScrollEnabled(false)
        //   scrollBridge.drag(dragAt)
        //   state.current.dragAt = dragAt
        //   state.current.dys.push(dy)
        //   // only do every so often, cut down to 10 again
        //   if (state.current.dys.length > 100) {
        //     state.current.dys = state.current.dys.slice(-10)
        //   }
        // }}
        {...props}
      >
        {children}
      </ScrollView>
    )
  }
)
