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
import { getWebKeyboardHeight, MIN_KEYBOARD_HEIGHT } from './webViewport'

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
    const { scrollBridge, setHasScrollView, hasFit, screenSize } = context
    const keyboardOccludedHeight = Math.max(0, context.keyboardOccludedHeight || 0)
    // OR a LIVE DOM check: context.isKeyboardVisible (React state) lags the
    // viewport resize, so on the open-transition render this component can re-run
    // with the shrunk consumer maxHeight BEFORE the context flag flips. reading
    // the keyboard height straight from visualViewport closes that race so the
    // height freeze engages on the same render that would otherwise collapse it.
    const isKeyboardVisible =
      context.isKeyboardVisible === true ||
      (isWeb && getWebKeyboardHeight() >= MIN_KEYBOARD_HEIGHT)
    const [scrollEnabled] = useControllableState({
      prop: scrollEnabledProp,
      defaultProp: true,
    })
    const scrollRef = React.useRef<RNScrollView | null>(null)

    const [hasScrollableContent, setHasScrollableContent] = useState(true)
    const parentHeight = useRef(0)
    const contentHeight = useRef(0)
    // the sheet's authoritative pre-keyboard frame height (see SheetImpl). a
    // scroll-view-local high-water mark used to live here, but it was unreliable
    // (the ref could read 0 if the view remounted on focus / never laid out while
    // closed), so the height now comes from the sheet, which doesn't remount.
    const frozenFrameHeight = Math.max(0, context.keyboardStableFrameHeight || 0)

    // with snapPointsMode="fit", Frame is content-sized (flex: 0, flex-basis: auto, height: undefined).
    // a flex: 1 child can't grow inside a content-sized parent, so the ScrollView (and the Frame
    // around it) collapse to 0 height. instead, let the ScrollView size to its content and cap it
    // at the available viewport (screenSize / maxContentSize) so scrolling kicks in for tall content.
    const fitSizingStyle = hasFit
      ? {
          flex: undefined as undefined,
          height: undefined as undefined,
          maxHeight: screenSize || undefined,
        }
      : { flex: 1 }

    // when the keyboard is open, pin the scroll view to the sheet's pre-keyboard
    // frame height (frozenFrameHeight), overriding any consumer maxHeight. on web
    // that maxHeight is often tied to useWindowDimensions, which SHRINKS when the
    // keyboard opens and would otherwise collapse the sheet. holding the height
    // constant means the frame only TRANSLATES up (no resize, no jump). applied
    // AFTER {...props} so it wins.
    const keyboardFrozenOverride =
      hasFit && isKeyboardVisible && frozenFrameHeight > 0
        ? { height: frozenFrameHeight, maxHeight: frozenFrameHeight }
        : null

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

    const updateScrollable = () => {
      if (parentHeight.current && contentHeight.current) {
        setHasScrollableContent(contentHeight.current > parentHeight.current)
      }
    }

    // track the fit height for the scrollable-content check. the keyboard-freeze
    // height is supplied by the sheet (frozenFrameHeight), not derived here.
    const recordFitHeight = (height: number) => {
      parentHeight.current = height
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
        {keyboardOccludedHeight > 0 && (
          <View
            data-sheet-keyboard-scroll-pad
            height={keyboardOccludedHeight}
            width="100%"
          />
        )}
      </View>
    )

    // RNGH ScrollView path
    if (useRNGHScrollView && RNGHScrollView && panGestureRef) {
      const RNGHComponent = RNGHScrollView as any
      return (
        <RNGHComponent
          ref={composeRefs(scrollRef as any, ref)}
          style={fitSizingStyle}
          scrollEventThrottle={1}
          scrollEnabled={scrollEnabled}
          simultaneousHandlers={[panGestureRef]}
          onLayout={(e: any) => {
            recordFitHeight(Math.ceil(e.nativeEvent.layout.height))
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
          {...keyboardFrozenOverride}
        >
          {contentWrapper}
        </RNGHComponent>
      )
    }

    // fallback ScrollView with platform-specific gesture props
    return (
      <ScrollView
        onLayout={(e) => {
          recordFitHeight(Math.ceil(e.nativeEvent.layout.height))
          updateScrollable()
        }}
        ref={composeRefs(scrollRef as any, ref)}
        {...fitSizingStyle}
        scrollEventThrottle={1}
        className="_ovs-contain"
        scrollEnabled={scrollEnabled}
        onScroll={(e) => {
          const { y } = e.nativeEvent.contentOffset
          scrollBridge.y = y
          if (y > 0) scrollBridge.scrollStartY = -1
          onScroll?.(e)
        }}
        contentContainerStyle={{ minHeight: '100%' }}
        {...gestureProps}
        {...props}
        {...keyboardFrozenOverride}
      >
        {contentWrapper}
      </ScrollView>
    )
  }
)
