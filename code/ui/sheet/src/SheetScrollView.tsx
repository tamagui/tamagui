import { composeRefs } from '@tamagui/compose-refs'
import { isWeb, View, type GetRef } from '@tamagui/core'
import type { ScrollViewProps } from '@tamagui/scroll-view'
import { ScrollView } from '@tamagui/scroll-view'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { useEffect, useRef, useState } from 'react'
import type { ScrollView as RNScrollView } from 'react-native'
import { useGestureSheetContext } from './GestureSheetContext'
import { getGestureHandlerState, isGestureHandlerEnabled } from './gestureState'
import { useSheetContext } from './SheetContext'
import type { SheetScopedProps } from './types'
import { useSheetScrollViewGestures } from './useSheetScrollViewGestures'

const SHEET_SCROLL_VIEW_NAME = 'SheetScrollView'

export const SheetScrollView = React.forwardRef<
  GetRef<typeof ScrollView>,
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
    const [scrollEnabled] = useControllableState({
      prop: scrollEnabledProp,
      defaultProp: true,
    })
    const scrollRef = React.useRef<RNScrollView | null>(null)

    const panGestureRef = gestureContext?.panGestureRef
    const { ScrollView: RNGHScrollView } = getGestureHandlerState()
    const useRNGHScrollView = isGestureHandlerEnabled() && RNGHScrollView && panGestureRef

    // RNGH scroll locking state
    const currentScrollOffset = useRef(0)
    const lockedScrollY = useRef(0)

    const setScrollEnabled = (next: boolean, lockTo?: number) => {
      if (!next) {
        const lockY = lockTo ?? currentScrollOffset.current
        lockedScrollY.current = lockY
        scrollBridge.scrollLockY = lockY
        scrollRef.current?.scrollTo?.({ x: 0, y: lockY, animated: false })
      } else {
        lockedScrollY.current = currentScrollOffset.current
        scrollBridge.scrollLockY = undefined
      }
    }

    const forceScrollTo = (y: number) => {
      scrollRef.current?.scrollTo?.({ x: 0, y, animated: false })
    }

    useEffect(() => {
      setHasScrollView(true)
      if (isGestureHandlerEnabled()) {
        scrollBridge.setScrollEnabled = setScrollEnabled
        scrollBridge.forceScrollTo = forceScrollTo
      }
      return () => {
        setHasScrollView(false)
        scrollBridge.setScrollEnabled = undefined
        scrollBridge.forceScrollTo = undefined
      }
    }, [])

    const [hasScrollableContent, setHasScrollableContent] = useState(true)
    const parentHeight = useRef(0)
    const contentHeight = useRef(0)

    const updateScrollable = () => {
      if (parentHeight.current && contentHeight.current) {
        setHasScrollableContent(contentHeight.current > parentHeight.current)
      }
    }

    useEffect(() => {
      scrollBridge.hasScrollableContent = hasScrollableContent
    }, [hasScrollableContent])

    // platform-specific gesture handling
    const gestureProps = useSheetScrollViewGestures({
      scrollRef,
      scrollBridge,
      hasScrollableContent,
      scrollEnabled,
      setScrollEnabled,
    })

    // content wrapper for measuring height
    const contentWrapper = (
      <View
        onLayout={(e) => {
          const height = Math.floor(e.nativeEvent.layout.height)
          if (height !== contentHeight.current) {
            contentHeight.current = height
            updateScrollable()
          }
        }}
      >
        {children}
      </View>
    )

    // RNGH ScrollView path
    if (useRNGHScrollView && RNGHScrollView && panGestureRef) {
      const RNGHComponent = RNGHScrollView as any
      return (
        <RNGHComponent
          ref={composeRefs(scrollRef as any, ref)}
          style={{ flex: 1 }}
          scrollEventThrottle={1}
          scrollEnabled={scrollEnabled}
          simultaneousHandlers={[panGestureRef]}
          onLayout={(e: any) => {
            parentHeight.current = Math.ceil(e.nativeEvent.layout.height)
            updateScrollable()
          }}
          onScroll={(e: any) => {
            const { y } = e.nativeEvent.contentOffset
            currentScrollOffset.current = y

            if (scrollBridge.scrollLockY !== undefined) {
              if (y !== scrollBridge.scrollLockY) {
                scrollRef.current?.scrollTo?.({
                  x: 0,
                  y: scrollBridge.scrollLockY,
                  animated: false,
                })
              }
              scrollBridge.y = scrollBridge.scrollLockY
              onScroll?.({
                ...e,
                nativeEvent: {
                  ...e.nativeEvent,
                  contentOffset: {
                    ...e.nativeEvent.contentOffset,
                    y: scrollBridge.scrollLockY,
                  },
                },
              })
              return
            }

            scrollBridge.y = y
            if (y > 0) scrollBridge.scrollStartY = -1
            onScroll?.(e)
          }}
          contentContainerStyle={{ minHeight: '100%' }}
          bounces={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          {...props}
        >
          {contentWrapper}
        </RNGHComponent>
      )
    }

    // fallback ScrollView with platform-specific gesture props
    return (
      <ScrollView
        onLayout={(e) => {
          parentHeight.current = Math.ceil(e.nativeEvent.layout.height)
          updateScrollable()
        }}
        ref={composeRefs(scrollRef as any, ref)}
        flex={1}
        scrollEventThrottle={1}
        className="_ovs-contain"
        scrollEnabled={scrollEnabled}
        onScroll={(e) => {
          const { y } = e.nativeEvent.contentOffset
          scrollBridge.y = y
          // note: on web, scrollLock is managed by useSheetScrollViewGestures
          // setting it here would cause race conditions with the touch handler
          if (y > 0) scrollBridge.scrollStartY = -1
          onScroll?.(e)
        }}
        contentContainerStyle={{ minHeight: '100%' }}
        {...gestureProps}
        {...props}
      >
        {contentWrapper}
      </ScrollView>
    )
  }
)
