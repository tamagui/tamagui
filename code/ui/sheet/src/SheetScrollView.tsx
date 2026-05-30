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
import {
  getWebKeyboardHeight,
  isEditableElement,
  MIN_KEYBOARD_HEIGHT,
} from './webViewport'

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

    // AUTOFOCUS-ON-OPEN seed (web): the sheet is still reconstructing its
    // pre-keyboard frame baseline and needs THIS scroll view to size to its
    // content so it can measure the true content height. so we apply the stable
    // screen only as a maxHeight cap (UNCLIP from the shrunk consumer maxHeight)
    // and leave height undefined so it stays content-sized.
    const isKeyboardSeeding = context.isKeyboardSeeding === true

    // when the keyboard is open the sheet stays ANCHORED at the bottom and keeps
    // its full pre-keyboard height — the keyboard overlays its lower part and the
    // keyboardOccludedHeight tail padding (added to the scroll content below) +
    // browser scroll-into-view lift the focused input above the keyboard. so we
    // pin the height to the sheet's authoritative frozenFrameHeight, overriding
    // any consumer maxHeight (on web that's often tied to useWindowDimensions,
    // which SHRINKS when the keyboard opens and would otherwise collapse the
    // sheet). holding the height constant means nothing animates on keyboard
    // open/close — no jump/teleport. applied AFTER {...props} so it wins.
    const keyboardFrozenOverride =
      hasFit && isKeyboardVisible && frozenFrameHeight > 0
        ? isKeyboardSeeding
          ? { maxHeight: frozenFrameHeight }
          : { height: frozenFrameHeight, maxHeight: frozenFrameHeight }
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

    // AUTOFOCUS-ON-OPEN recovery (web). when an input autofocuses as the sheet
    // opens, the browser's native scroll-into-view fires before the keyboard
    // padding (keyboardOccludedHeight) and frozen height have laid out, so the
    // focused input can stay occluded under the keyboard — the "tap the input
    // again to fix it" symptom. once the keyboard is up and the layout has
    // settled, explicitly scroll the focused input above the keyboard, which is
    // exactly what that second tap's scroll-into-view does. measure against the
    // visualViewport (the real visible region) rather than the scroll view's own
    // box, whose lower part is occluded by the keyboard.
    useEffect(() => {
      if (!isWeb || !hasFit || !isKeyboardVisible) return
      if (typeof window === 'undefined' || typeof document === 'undefined') return
      let raf = 0
      let frames = 0
      let lastBottom = Number.NaN
      let stableFrames = 0
      const findScroller = (el: HTMLElement): HTMLElement | null => {
        let n: HTMLElement | null = el.parentElement
        while (n) {
          const overflowY = getComputedStyle(n).overflowY
          if (
            (overflowY === 'auto' || overflowY === 'scroll') &&
            n.scrollHeight > n.clientHeight
          ) {
            return n
          }
          n = n.parentElement
        }
        return null
      }
      const tick = () => {
        frames++
        const el = document.activeElement as HTMLElement | null
        if (!el || !isEditableElement(el)) return
        // CRITICAL: wait for the open animation to settle before measuring. the
        // frame slides up over several frames; measuring mid-animation reads the
        // input far down the (still-low) frame, yields a huge overlap, and
        // overscrolls the focused input off the top. so we wait until the input's
        // viewport position stops changing (or a frame cap) before scrolling.
        const bottom = el.getBoundingClientRect().bottom
        if (Number.isNaN(lastBottom) || Math.abs(bottom - lastBottom) > 1) {
          lastBottom = bottom
          stableFrames = 0
          if (frames < 60) {
            raf = requestAnimationFrame(tick)
            return
          }
        } else if (stableFrames < 3 && frames < 60) {
          stableFrames++
          raf = requestAnimationFrame(tick)
          return
        }
        const scroller = findScroller(el)
        if (!scroller) return
        const vv = window.visualViewport
        const keyboardTop = vv ? vv.offsetTop + vv.height : window.innerHeight
        // only scroll the minimum needed to lift the input clear of the keyboard;
        // no-op when it's already visible (e.g. an autofocused title at the top).
        const overlap = Math.round(
          el.getBoundingClientRect().bottom - (keyboardTop - 16)
        )
        if (overlap > 0) scroller.scrollTop += overlap
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }, [isKeyboardVisible, hasFit])

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
