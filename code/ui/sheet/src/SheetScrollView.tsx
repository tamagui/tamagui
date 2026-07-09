import { composeRefs } from '@tamagui/compose-refs'
import { isWeb, View, type GetRef, createRefComponent } from '@tamagui/core'
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
  getStableLayoutViewportHeight,
  getWebKeyboardBottomInset,
  getWebKeyboardResizeHeight,
  isEditableElement,
  MIN_KEYBOARD_HEIGHT,
} from './webViewport'

const SHEET_SCROLL_VIEW_NAME = 'SheetScrollView'

export const SheetScrollView = createRefComponent<
  GetRef<typeof ScrollView>,
  ScrollViewProps
>(
  (
    {
      scope,
      children,
      onScroll,
      scrollEnabled: scrollEnabledProp,
      ...props
    }: SheetScopedProps<ScrollViewProps>,
    ref
  ) => {
    const context = useSheetContext(scope)
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
      (isWeb && getWebKeyboardResizeHeight() >= MIN_KEYBOARD_HEIGHT)
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

    // with snapPointsMode="fit", Container is content-sized (flex: 0, flex-basis: auto, height: undefined).
    // a flex: 1 child can't grow inside a content-sized parent, so the ScrollView (and the Container
    // around it) collapse to 0 height. instead, let the ScrollView size to its content and cap it
    // at the available viewport (screenSize / maxContentSize) so scrolling kicks in for tall content.
    const fitSizingStyle = hasFit
      ? {
          flex: undefined as undefined,
          height: undefined as undefined,
          maxHeight: screenSize || undefined,
        }
      : { flex: 1 }
    const contentContainerStyle = hasFit ? undefined : { minHeight: '100%' as const }

    // when the keyboard is open, pin the scroll view to the sheet's pre-keyboard
    // frame height (frozenFrameHeight), overriding any consumer maxHeight. on web
    // that maxHeight is often tied to useWindowDimensions, which SHRINKS when the
    // keyboard opens and would otherwise collapse the sheet. holding the height
    // constant means the web frame can translate without resizing. applied
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
    const lastEmittedScrollOffset = useRef(0)
    const lockedScrollY = useRef(0)
    const focusedInputScrollFrame = useRef(0)

    const setScrollEnabled = (next: boolean, lockTo?: number) => {
      if (!next) {
        const lockY = lockTo ?? scrollBridge.scrollLockY ?? currentScrollOffset.current
        if (scrollBridge.enabled === false && scrollBridge.scrollLockY === lockY) {
          return
        }
        scrollBridge.enabled = false
        lockedScrollY.current = lockY
        scrollBridge.scrollLockY = lockY
        if (currentScrollOffset.current !== lockY) {
          scrollRef.current?.scrollTo?.({ x: 0, y: lockY, animated: false })
          currentScrollOffset.current = lockY
        }
      } else {
        if (scrollBridge.enabled === true && scrollBridge.scrollLockY === undefined) {
          return
        }
        scrollBridge.enabled = true
        lockedScrollY.current = currentScrollOffset.current
        scrollBridge.scrollLockY = undefined
      }
    }

    const forceScrollTo = (y: number) => {
      scrollRef.current?.scrollTo?.({ x: 0, y, animated: false })
      currentScrollOffset.current = y
    }

    const emitManualScroll = React.useCallback(
      (node: HTMLElement, y: number) => {
        currentScrollOffset.current = y
        scrollBridge.y = y
        if (y > 0) scrollBridge.scrollStartY = -1
        lastEmittedScrollOffset.current = y
        onScroll?.({
          nativeEvent: {
            contentOffset: {
              x: node.scrollLeft,
              y,
            },
            contentSize: {
              height: node.scrollHeight,
              width: node.scrollWidth,
            },
            layoutMeasurement: {
              height: node.offsetHeight,
              width: node.offsetWidth,
            },
          },
          timeStamp: Date.now(),
        } as any)
      },
      [onScroll, scrollBridge]
    )

    const scrollFocusedInputClearOfKeyboard = React.useCallback(() => {
      if (!isWeb || !hasFit || !isKeyboardVisible || keyboardOccludedHeight <= 0) {
        return
      }
      const node = scrollRef.current?.getScrollableNode() as HTMLElement | undefined
      const active = document.activeElement as HTMLElement | null
      if (!node || !active || !isEditableElement(active) || !node.contains(active)) {
        return
      }

      const keyboardHeight = Math.max(keyboardOccludedHeight, getWebKeyboardBottomInset())
      if (keyboardHeight <= 0) return

      const activeRect = active.getBoundingClientRect()
      const nodeRect = node.getBoundingClientRect()
      const margin = 12
      const keyboardTop = getStableLayoutViewportHeight() - keyboardHeight
      const visibleTop = nodeRect.top + margin
      const visibleBottom = Math.min(nodeRect.bottom, keyboardTop) - margin
      let nextScrollTop = node.scrollTop

      if (activeRect.bottom > visibleBottom) {
        nextScrollTop += Math.ceil(activeRect.bottom - visibleBottom)
      } else if (activeRect.top < visibleTop) {
        nextScrollTop -= Math.ceil(visibleTop - activeRect.top)
      }

      const maxScrollTop = Math.max(0, node.scrollHeight - node.clientHeight)
      nextScrollTop = Math.max(0, Math.min(maxScrollTop, nextScrollTop))
      if (nextScrollTop === node.scrollTop) return

      node.scrollTop = nextScrollTop
      currentScrollOffset.current = nextScrollTop
      scrollBridge.y = nextScrollTop
      if (nextScrollTop > 0) scrollBridge.scrollStartY = -1
    }, [hasFit, isKeyboardVisible, keyboardOccludedHeight, scrollBridge])

    const scheduleFocusedInputScroll = React.useCallback(() => {
      if (!isWeb || !hasFit) return
      cancelAnimationFrame(focusedInputScrollFrame.current)
      focusedInputScrollFrame.current = requestAnimationFrame(() => {
        scrollFocusedInputClearOfKeyboard()
        focusedInputScrollFrame.current = requestAnimationFrame(
          scrollFocusedInputClearOfKeyboard
        )
      })
    }, [hasFit, scrollFocusedInputClearOfKeyboard])

    useEffect(() => {
      if (!isWeb || !hasFit) return
      scheduleFocusedInputScroll()
      window.addEventListener('focusin', scheduleFocusedInputScroll)
      window.visualViewport?.addEventListener('resize', scheduleFocusedInputScroll)

      return () => {
        cancelAnimationFrame(focusedInputScrollFrame.current)
        window.removeEventListener('focusin', scheduleFocusedInputScroll)
        window.visualViewport?.removeEventListener('resize', scheduleFocusedInputScroll)
      }
    }, [hasFit, scheduleFocusedInputScroll])

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
      onManualScroll: emitManualScroll,
    })

    // content wrapper for measuring height
    const contentWrapper = (
      <View
        onLayout={(e) => {
          const height = Math.floor(e.nativeEvent.layout.height)
          if (height !== contentHeight.current) {
            contentHeight.current = height
            updateScrollable()
            if (keyboardOccludedHeight > 0) {
              scheduleFocusedInputScroll()
            }
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
              currentScrollOffset.current = scrollBridge.scrollLockY
              scrollBridge.y = scrollBridge.scrollLockY
              if (lastEmittedScrollOffset.current !== scrollBridge.scrollLockY) {
                lastEmittedScrollOffset.current = scrollBridge.scrollLockY
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
              }
              return
            }

            scrollBridge.y = y
            if (y > 0) scrollBridge.scrollStartY = -1
            lastEmittedScrollOffset.current = y
            onScroll?.(e)
          }}
          contentContainerStyle={contentContainerStyle}
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
          currentScrollOffset.current = y
          scrollBridge.y = y
          if (y > 0) scrollBridge.scrollStartY = -1
          lastEmittedScrollOffset.current = y
          onScroll?.(e)
        }}
        contentContainerStyle={contentContainerStyle}
        {...gestureProps}
        {...props}
        {...keyboardFrozenOverride}
      >
        {contentWrapper}
      </ScrollView>
    )
  }
)
