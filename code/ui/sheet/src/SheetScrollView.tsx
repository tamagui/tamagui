import { composeRefs } from '@tamagui/compose-refs'
import { isClient, isWeb, View, type GetRef } from '@tamagui/core'
import type { ScrollViewProps } from '@tamagui/scroll-view'
import { ScrollView } from '@tamagui/scroll-view'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { useEffect, useRef, useState } from 'react'
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
  // we disallow customizing it because we want to let people know it doens't work well with out measuring of inner content
  // height using a view
  ScrollViewProps
>(
  (
    {
      __scopeSheet,
      children,
      onScroll,
      scrollEnabled: scrollEnabledProp,
      ...props
    }: SheetScopedProps<ScrollViewProps>,
    ref
  ) => {
    const context = useSheetContext(SHEET_SCROLL_VIEW_NAME, __scopeSheet)
    const { scrollBridge, setHasScrollView } = context
    const [scrollEnabled, setScrollEnabled_] = useControllableState({
      prop: scrollEnabledProp,
      defaultProp: true,
    })
    const scrollRef = React.useRef<RNScrollView | null>(null)

    // could make it so it has negative bottom margin and then pads the bottom content
    // to avoid clipping effect when resizing smaller
    // or more ideally could use context to register if it has a scrollview and change behavior
    // const offscreenSize = useSheetOffscreenSize(context)

    const setScrollEnabled = (next: boolean) => {
      scrollRef.current?.setNativeProps?.({
        scrollEnabled: next,
      })
      setScrollEnabled_(next)
    }

    const state = React.useRef({
      lastPageY: 0,
      dragAt: 0,
      dys: [] as number[], // store a few recent dys to get velocity on release
      isScrolling: false,
      isDraggingScrollArea: false,
    })

    useEffect(() => {
      setHasScrollView(true)
      return () => {
        setHasScrollView(false)
      }
    }, [])

    const release = () => {
      if (!state.current.isDraggingScrollArea) {
        return
      }
      state.current.isDraggingScrollArea = false
      scrollBridge.scrollStartY = -1
      scrollBridge.scrollLock = false
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

    const scrollable = scrollEnabled

    useEffect(() => {
      if (!isClient) return
      if (!scrollRef.current) return

      const controller = new AbortController()

      const node = scrollRef.current?.getScrollableNode() as HTMLElement | undefined

      if (!node) {
        return
      }

      // this is unfortuantely the only way to prevent a scroll once a scroll already started
      // we just keep setting it back to the last value - it should only ever be 0 as this only
      // ever runs when you  scroll down, then back to top and start dragging, then back to scroll
      node.addEventListener(
        'touchmove',
        (e) => {
          if (scrollBridge.isParentDragging) {
            node.scrollTo({
              top: scrollBridge.y,
              behavior: 'instant',
            })
            // can't preventdefault its not cancellable
          }
        },
        {
          signal: controller.signal,
          passive: false,
        }
      )

      const disposeBridgeListen = scrollBridge.onParentDragging((val) => {
        if (val) {
        }
      })

      return () => {
        disposeBridgeListen()
        controller.abort()
      }
    }, [scrollRef])

    const [hasScrollableContent, setHasScrollableContent] = useState(true)
    const parentHeight = useRef(0)
    const contentHeight = useRef(0)

    const setIsScrollable = () => {
      if (parentHeight.current && contentHeight.current) {
        setHasScrollableContent(contentHeight.current > parentHeight.current)
      }
    }

    useEffect(() => {
      scrollBridge.hasScrollableContent = hasScrollableContent
    }, [hasScrollableContent])

    return (
      <ScrollView
        onLayout={(e) => {
          parentHeight.current = Math.ceil(e.nativeEvent.layout.height)
          setIsScrollable()
        }}
        ref={composeRefs(scrollRef as any, ref)}
        flex={1}
        scrollEventThrottle={8}
        onResponderRelease={release}
        className="_ovs-contain"
        scrollEnabled={scrollable}
        // {...(Platform.OS === 'android' && {
        //   pointerEvents: scrollable ? undefined : 'none',
        // })}
        onScroll={(e) => {
          const { y } = e.nativeEvent.contentOffset
          scrollBridge.y = y

          if (isWeb) {
            scrollBridge.scrollLock = y > 0
          }
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
          state.current.isDraggingScrollArea = true
          return scrollable
        }}
        // setting to false while onResponderMove is disabled
        onMoveShouldSetResponder={(e) => {
          return scrollable
        }}
        contentContainerStyle={{
          minHeight: '100%',
        }}
        onResponderMove={(e) => {
          // limiting to web as its tested on web
          if (isWeb) {
            const { pageY } = e.nativeEvent

            if (!state.current.isScrolling) {
              if (scrollBridge.scrollStartY === -1) {
                scrollBridge.scrollStartY = pageY
                state.current.lastPageY = pageY
              }
            }

            const dragAt = pageY - scrollBridge.scrollStartY
            const dy = pageY - state.current.lastPageY
            state.current.lastPageY = pageY // after dy
            const isDraggingUp = dy < 0
            const isPaneAtTop = scrollBridge.paneY <= scrollBridge.paneMinY

            const shouldScrollLock =
              hasScrollableContent && (dy === 0 || isDraggingUp) && isPaneAtTop

            if (shouldScrollLock && !state.current.isScrolling) {
              state.current.isScrolling = true
              scrollBridge.scrollLock = true
              setScrollEnabled(true)
              return
            }

            const isDraggingUpFromTopOnFirstScroll =
              !state.current.isScrolling && dy > 0 && scrollBridge.y === 0

            if (!isDraggingUpFromTopOnFirstScroll && scrollBridge.y >= 0) {
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
        {...props}
      >
        {/* content height measurer */}
        <View
          position="absolute"
          inset={0}
          pointerEvents="none"
          zIndex={-1}
          onLayout={(e) => {
            // found that contentHeight can be 0.x higher than parent when not scrollable
            contentHeight.current = Math.floor(e.nativeEvent.layout.height)
            setIsScrollable()
          }}
        />

        {children}
      </ScrollView>
    )
  }
)
