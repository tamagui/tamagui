import { View as TamaguiView } from '@tamagui/web'
import * as React from 'react'

// loosely typed to map the react-native ScrollView prop surface onto a
// tamagui View without fighting the strict styled-view prop types.
const View = TamaguiView as any

// clean-room web ScrollView: an overflow-scrolling tamagui View that maps the
// subset of the react-native ScrollView API that tamagui + its consumers use.
// this replaces the previous dependency on react-native (aliased to
// react-native-web-lite) so @tamagui/scroll-view no longer pulls react-native
// into web bundles. the native implementation lives in ScrollView.native.tsx.

export interface ScrollViewMethods {
  getScrollResponder: () => any
  getScrollableNode: () => HTMLElement
  getInnerViewNode: () => HTMLElement
  getInnerViewRef: () => HTMLElement
  getNativeScrollRef: () => HTMLElement
  scrollTo: (options?: { x?: number; y?: number; animated?: boolean }) => void
  scrollToEnd: (options?: { animated?: boolean }) => void
  flashScrollIndicators: () => void
}

export type ScrollViewRef = HTMLElement & ScrollViewMethods

function mergeRefs(...refs: any[]) {
  return (node: any) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') ref(node)
      else ref.current = node
    }
  }
}

function normalizeScrollEvent(e: any) {
  const target = e.target
  return {
    nativeEvent: {
      contentOffset: {
        get x() {
          return target.scrollLeft
        },
        get y() {
          return target.scrollTop
        },
      },
      contentSize: {
        get height() {
          return target.scrollHeight
        },
        get width() {
          return target.scrollWidth
        },
      },
      layoutMeasurement: {
        get height() {
          return target.offsetHeight
        },
        get width() {
          return target.offsetWidth
        },
      },
    },
    timeStamp: Date.now(),
  }
}

function shouldEmitScrollEvent(lastTick: number, eventThrottle: number) {
  const timeSinceLastTick = Date.now() - lastTick
  return eventThrottle > 0 && timeSinceLastTick >= eventThrottle
}

// tamagui hands styled(non-tamagui) bases react-native-web style objects: real
// style values are plain keys, resolved atomic styles arrive as { $$css: true,
// className: className } maps. split those apart so classNames land on className
// and only real values land on style (merging them poisons the whole object as a
// className map). arrays are flattened recursively.
function resolveStyles(...inputs: any[]): { style: any; className: string } {
  const style: any = {}
  const classNames: string[] = []
  const walk = (s: any) => {
    if (!s) return
    if (Array.isArray(s)) {
      for (const item of s) walk(item)
      return
    }
    if (s.$$css) {
      for (const k in s) {
        if (k !== '$$css') classNames.push(s[k])
      }
    } else {
      Object.assign(style, s)
    }
  }
  for (const input of inputs) walk(input)
  return { style, className: classNames.join(' ') }
}

function joinClassNames(...parts: (string | undefined | false)[]): string | undefined {
  const joined = parts.filter(Boolean).join(' ').trim()
  return joined || undefined
}

const commonStyle = {
  flexGrow: 1,
  flexShrink: 1,
} as const

const styles = {
  baseVertical: {
    ...commonStyle,
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  baseHorizontal: {
    ...commonStyle,
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  contentContainerHorizontal: {
    flexDirection: 'row',
  },
  contentContainerCenterContent: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  pagingEnabledHorizontal: {
    scrollSnapType: 'x mandatory',
  },
  pagingEnabledVertical: {
    scrollSnapType: 'y mandatory',
  },
  pagingEnabledChild: {
    scrollSnapAlign: 'start',
  },
  scrollDisabled: {
    overflowX: 'hidden',
    overflowY: 'hidden',
    touchAction: 'none',
  },
} as const

export const WebScrollView = React.forwardRef<ScrollViewRef, any>(
  (props, forwardedRef) => {
    const {
      children,
      contentContainerStyle,
      horizontal,
      onContentSizeChange,
      onScroll,
      refreshControl,
      stickyHeaderIndices,
      pagingEnabled,
      centerContent,
      scrollEnabled = true,
      scrollEventThrottle = 0,
      showsHorizontalScrollIndicator,
      showsVerticalScrollIndicator,
      style,
      // strip react-native-only props that shouldn't reach the DOM
      keyboardShouldPersistTaps,
      keyboardDismissMode,
      contentOffset,
      contentInset,
      contentInsetAdjustmentBehavior,
      decelerationRate,
      directionalLockEnabled,
      disableIntervalMomentum,
      disableScrollViewPanResponder,
      endFillColor,
      fadingEdgeLength,
      indicatorStyle,
      invertStickyHeaders,
      maintainVisibleContentPosition,
      maximumZoomScale,
      minimumZoomScale,
      nestedScrollEnabled,
      onScrollToTop,
      overScrollMode,
      pinchGestureEnabled,
      removeClippedSubviews,
      scrollIndicatorInsets,
      scrollPerfTag,
      scrollToOverflowEnabled,
      snapToAlignment,
      snapToEnd,
      snapToInterval,
      snapToOffsets,
      snapToStart,
      bounces,
      ...rest
    } = props

    // tamagui treats this styled base as a react-native component, so it hands
    // data-* attributes down as a `dataSet` map (the react-native-web convention).
    // @tamagui/web's View doesn't expand that back, so do it here to keep
    // data-testid and friends on the DOM node.
    const { dataSet, ...domRest } = rest as any
    const dataAttrs: Record<string, any> = {}
    if (dataSet) {
      for (const key in dataSet) {
        dataAttrs[`data-${key}`] = dataSet[key]
      }
    }

    const scrollNodeRef = React.useRef<any>(null)
    const innerViewRef = React.useRef<any>(null)
    const scrollState = React.useRef({ isScrolling: false, scrollLastTick: 0 })
    const scrollTimeout = React.useRef<any>(null)

    const scrollTo = (options?: { x?: number; y?: number; animated?: boolean }) => {
      const node = scrollNodeRef.current
      if (node == null) return
      const { x = 0, y = 0, animated = true } = options || {}
      if (typeof node.scroll === 'function') {
        node.scroll({ top: y, left: x, behavior: animated ? 'smooth' : 'auto' })
      } else {
        node.scrollLeft = x
        node.scrollTop = y
      }
    }

    const scrollToEnd = (options?: { animated?: boolean }) => {
      const node = scrollNodeRef.current
      if (node == null) return
      const animated = (options && options.animated) !== false
      const x = horizontal ? node.scrollWidth : 0
      const y = horizontal ? 0 : node.scrollHeight
      scrollTo({ x, y, animated })
    }

    const setScrollNodeRef = React.useCallback(
      (node: any) => {
        scrollNodeRef.current = node
        if (node != null) {
          node.getScrollResponder = () => node
          node.getScrollableNode = () => node
          node.getInnerViewNode = () => innerViewRef.current
          node.getInnerViewRef = () => innerViewRef.current
          node.getNativeScrollRef = () => node
          node.scrollTo = scrollTo
          node.scrollToEnd = scrollToEnd
          node.flashScrollIndicators = () => {}
        }
        mergeRefs(forwardedRef)(node)
      },
      [forwardedRef, horizontal]
    )

    function handleScroll(e: any) {
      e.stopPropagation()
      if (e.target !== scrollNodeRef.current) return
      if (scrollTimeout.current != null) {
        clearTimeout(scrollTimeout.current)
      }
      scrollTimeout.current = setTimeout(() => {
        scrollState.current.isScrolling = false
        onScroll?.(normalizeScrollEvent(e))
      }, 100)
      if (scrollState.current.isScrolling) {
        if (
          shouldEmitScrollEvent(scrollState.current.scrollLastTick, scrollEventThrottle)
        ) {
          scrollState.current.scrollLastTick = Date.now()
          onScroll?.(normalizeScrollEvent(e))
        }
      } else {
        scrollState.current.isScrolling = true
        scrollState.current.scrollLastTick = Date.now()
        onScroll?.(normalizeScrollEvent(e))
      }
    }

    const handleContentLayout = onContentSizeChange
      ? (e: any) => {
          const { width, height } = e.nativeEvent.layout
          onContentSizeChange(width, height)
        }
      : undefined

    const hasStickyHeaderIndices = !horizontal && Array.isArray(stickyHeaderIndices)
    const renderedChildren =
      hasStickyHeaderIndices || pagingEnabled
        ? React.Children.map(children, (child, i) => {
            const isSticky = hasStickyHeaderIndices && stickyHeaderIndices.indexOf(i) > -1
            if (child != null && (isSticky || pagingEnabled)) {
              const resolved = resolveStyles(
                isSticky && styles.stickyHeader,
                pagingEnabled && styles.pagingEnabledChild
              )
              return (
                <View
                  style={resolved.style}
                  className={joinClassNames(resolved.className)}
                >
                  {child}
                </View>
              )
            }
            return child
          })
        : children

    const contentResolved = resolveStyles(
      horizontal && styles.contentContainerHorizontal,
      centerContent && styles.contentContainerCenterContent,
      contentContainerStyle
    )
    const contentContainer = (
      <View
        ref={innerViewRef}
        onLayout={handleContentLayout}
        style={contentResolved.style}
        className={joinClassNames(contentResolved.className)}
      >
        {renderedChildren}
      </View>
    )

    const baseStyle = horizontal ? styles.baseHorizontal : styles.baseVertical
    const pagingEnabledStyle = horizontal
      ? styles.pagingEnabledHorizontal
      : styles.pagingEnabledVertical

    const hideHorizontalScrollbar = showsHorizontalScrollIndicator === false
    const hideVerticalScrollbar = showsVerticalScrollIndicator === false
    const extraClassName =
      (hideHorizontalScrollbar ? ' _hsb-x' : '') +
      (hideVerticalScrollbar ? ' _hsb-y' : '')

    const scrollResolved = resolveStyles(
      baseStyle,
      pagingEnabled && pagingEnabledStyle,
      style,
      !scrollEnabled && styles.scrollDisabled
    )
    const scrollView = (
      <View
        {...domRest}
        {...dataAttrs}
        className={joinClassNames(
          domRest.className,
          scrollResolved.className,
          extraClassName
        )}
        ref={setScrollNodeRef}
        onScroll={handleScroll}
        style={scrollResolved.style}
      >
        {contentContainer}
      </View>
    )

    if (refreshControl) {
      const refreshResolved = resolveStyles(baseStyle, style)
      return React.cloneElement(
        refreshControl,
        {
          style: refreshResolved.style,
          className: joinClassNames(refreshResolved.className),
        },
        scrollView
      )
    }

    return scrollView
  }
)

WebScrollView.displayName = 'ScrollView'
