import { composeRefs } from '@tamagui/compose-refs'
import { isClient, isWeb, View, type GetRef } from '@tamagui/core'
import type { ScrollViewProps } from '@tamagui/scroll-view'
import { ScrollView } from '@tamagui/scroll-view'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { useEffect, useRef, useState } from 'react'
import type { ScrollView as RNScrollView } from 'react-native'
import { useGestureSheetContext } from './GestureSheetContext'
import { getGestureHandlerState, isGestureHandlerEnabled } from './gestureState'
import { useSheetContext } from './SheetContext'
import type { SheetScopedProps } from './types'

// uses react-native-gesture-handler's simultaneousWithExternalGesture for native-quality coordination

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
    const gestureContext = useGestureSheetContext()
    const { scrollBridge, setHasScrollView } = context
    const [scrollEnabled, setScrollEnabled_] = useControllableState({
      prop: scrollEnabledProp,
      defaultProp: true,
    })
    const scrollRef = React.useRef<RNScrollView | null>(null)

    // get the pan gesture ref for simultaneousHandlers
    // react-native-actions-sheet pattern: pass panGestureRef to ScrollView's simultaneousHandlers
    const panGestureRef = gestureContext?.panGestureRef

    // get RNGH ScrollView from gestureState (passed via setupGestureHandler to avoid double registration)
    const { ScrollView: RNGHScrollView } = getGestureHandlerState()

    // determine which ScrollView component to use - need RNGH ScrollView for simultaneousHandlers
    const useRNGHScrollView = isGestureHandlerEnabled() && RNGHScrollView && panGestureRef

    // console.warn('[RNGH-Scroll] Setup:', {
    //   enabled: isGestureHandlerEnabled(),
    //   hasRNGHScrollView: !!RNGHScrollView,
    //   hasPanRef: !!panGestureRef,
    //   useRNGHScrollView
    // })

    // could make it so it has negative bottom margin and then pads the bottom content
    // to avoid clipping effect when resizing smaller
    // or more ideally could use context to register if it has a scrollview and change behavior
    // const offscreenSize = useSheetOffscreenSize(context)

    // actions-sheet pattern: track scroll offset continuously via ref
    // this is updated on EVERY scroll event so it's always current
    const currentScrollOffset = useRef(0)
    // the position to lock at when scroll is disabled
    const lockedScrollY = useRef(0)

    const setScrollEnabled = (next: boolean, lockTo?: number) => {
      // console.warn('[RNGH-Scroll] setScrollEnabled', next, 'currentOffset:', currentScrollOffset.current, 'lockTo:', lockTo)
      if (!next) {
        // locking scroll - freeze at specified position or CURRENT position
        // if lockTo is provided (e.g., 0), use that; otherwise freeze at current
        // key insight: we use currentScrollOffset which is updated every onScroll
        // this ensures we freeze at the actual position, not a stale value
        const lockY = lockTo ?? currentScrollOffset.current
        lockedScrollY.current = lockY
        scrollBridge.scrollLockY = lockY
        // console.warn('[RNGH-Scroll] LOCKING at', lockY)
        // immediately scroll to lock position
        scrollRef.current?.scrollTo?.({
          x: 0,
          y: lockY,
          animated: false,
        })
      } else {
        // unlocking - save current position before clearing lock
        lockedScrollY.current = currentScrollOffset.current
        scrollBridge.scrollLockY = undefined
        // console.warn('[RNGH-Scroll] UNLOCKING at', lockedScrollY.current)
      }
      // NOTE: intentionally NOT using setNativeProps or scrollEnabled state
      // because that kills the RNGH scroll gesture mid-touch, breaking handoff.
      // This is the react-native-actions-sheet pattern: both gestures run,
      // we use scrollLockY + scrollTo to "freeze" scroll position during pan.
    }

    // force scroll to specific position (called from pan gesture to compensate for async props)
    const forceScrollTo = (y: number) => {
      // console.warn('[RNGH-Scroll] forceScrollTo:', y)
      scrollRef.current?.scrollTo?.({
        x: 0,
        y,
        animated: false,
      })
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

      // register setScrollEnabled on scrollBridge for RNGH coordination
      if (isGestureHandlerEnabled()) {
        scrollBridge.setScrollEnabled = setScrollEnabled
        scrollBridge.forceScrollTo = forceScrollTo
      }

      return () => {
        setHasScrollView(false)
        if (scrollBridge.setScrollEnabled) {
          scrollBridge.setScrollEnabled = undefined
        }
        if (scrollBridge.forceScrollTo) {
          scrollBridge.forceScrollTo = undefined
        }
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
        const isScrollable = contentHeight.current > parentHeight.current
        setHasScrollableContent(isScrollable)
      }
    }

    useEffect(() => {
      scrollBridge.hasScrollableContent = hasScrollableContent
    }, [hasScrollableContent])

    // Use RNGH ScrollView with simultaneousHandlers for native-quality gesture coordination
    // Pattern from react-native-actions-sheet: pass panGestureRef to simultaneousHandlers
    if (useRNGHScrollView && RNGHScrollView && panGestureRef) {
      const RNGHComponent = RNGHScrollView as any
      // console.warn('[RNGH-Scroll] RENDER with simultaneousHandlers')
      return (
        <RNGHComponent
          ref={composeRefs(scrollRef as any, ref)}
          style={{ flex: 1 }}
          scrollEventThrottle={1}
          scrollEnabled={scrollable}
          simultaneousHandlers={[panGestureRef]}
          onLayout={(e: any) => {
            parentHeight.current = Math.ceil(e.nativeEvent.layout.height)
            setIsScrollable()
          }}
          onScroll={(e: any) => {
            const { y } = e.nativeEvent.contentOffset

            // actions-sheet pattern: ALWAYS track current offset
            // this ensures setScrollEnabled knows the exact current position
            currentScrollOffset.current = y

            // if scroll is locked, force it back to lock position
            if (scrollBridge.scrollLockY !== undefined) {
              if (y !== scrollBridge.scrollLockY) {
                scrollRef.current?.scrollTo?.({
                  x: 0,
                  y: scrollBridge.scrollLockY,
                  animated: false,
                })
              }
              // still update bridge y to the lock position for consistency
              scrollBridge.y = scrollBridge.scrollLockY
              // fire callback but with locked position (for UI updates)
              const lockedEvent = {
                ...e,
                nativeEvent: {
                  ...e.nativeEvent,
                  contentOffset: {
                    ...e.nativeEvent.contentOffset,
                    y: scrollBridge.scrollLockY,
                  },
                },
              }
              onScroll?.(lockedEvent)
              return
            }

            // console.warn('[RNGH-Scroll] y:', y)
            scrollBridge.y = y
            if (y > 0) {
              scrollBridge.scrollStartY = -1
            }
            onScroll?.(e)
          }}
          contentContainerStyle={{ minHeight: '100%' }}
          bounces={false}
          {...props}
        >
          {/* wrapper to measure actual content height (not min-height expanded) */}
          <View
            onLayout={(e) => {
              const height = Math.floor(e.nativeEvent.layout.height)
              // only update if different to avoid loops
              if (height !== contentHeight.current) {
                contentHeight.current = height
                setIsScrollable()
              }
            }}
          >
            {children}
          </View>
        </RNGHComponent>
      )
    }

    // Fallback: regular Tamagui ScrollView for web or when RNGH not available
    const content = (
      <ScrollView
        onLayout={(e) => {
          parentHeight.current = Math.ceil(e.nativeEvent.layout.height)
          setIsScrollable()
        }}
        ref={composeRefs(scrollRef as any, ref)}
        flex={1}
        scrollEventThrottle={1}
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
          // don't claim responder on start - let children handle taps
          // we'll claim on move if needed
          return false
        }}
        onMoveShouldSetResponder={(e) => {
          if (!scrollable) return false
          // require minimum movement (10px) before claiming responder
          // this allows children (like Select.Item) to handle taps
          // fixes #3436: onPress not firing on physical Android devices
          const { pageY } = e.nativeEvent
          if (state.current.lastPageY === 0) {
            state.current.lastPageY = pageY
            return false
          }
          const dy = Math.abs(pageY - state.current.lastPageY)
          return dy > 10
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
        {/* wrapper to measure actual content height */}
        <View
          onLayout={(e) => {
            const height = Math.floor(e.nativeEvent.layout.height)
            if (height !== contentHeight.current) {
              contentHeight.current = height
              setIsScrollable()
            }
          }}
        >
          {children}
        </View>
      </ScrollView>
    )

    return content
  }
)
