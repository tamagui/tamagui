import * as ReactDOM from 'react-dom'
import { detectOverflow, offset } from '@floating-ui/react-dom'
import type { Middleware, MiddlewareState } from '@floating-ui/react-dom'

// ported from floating-ui/react/_deprecated-inner.ts
// positions the floating element so an inner list item aligns with the reference

export interface InnerProps {
  listRef: React.RefObject<Array<HTMLElement | null>>
  index: number | null
  offset?: number
  overflowRef: React.RefObject<any>
  onFallbackChange?: null | ((fallback: boolean) => void)
  padding?: number
  minItemsVisible?: number
  referenceOverflowThreshold?: number
  scrollRef?: React.RefObject<HTMLElement | null>
}

function getArgsWithCustomFloatingHeight(state: MiddlewareState, height: number) {
  return {
    ...state,
    rects: {
      ...state.rects,
      floating: {
        ...state.rects.floating,
        height,
      },
    },
  }
}

export const inner = (props: InnerProps): Middleware => ({
  name: 'inner',
  options: props,
  async fn(state: MiddlewareState) {
    const {
      listRef,
      overflowRef,
      onFallbackChange,
      offset: innerOffset = 0,
      index = 0,
      minItemsVisible = 4,
      referenceOverflowThreshold = 0,
      scrollRef,
      padding = 0,
    } = props

    const {
      rects,
      elements: { floating },
    } = state

    const item = listRef.current?.[index ?? 0]
    const scrollEl = scrollRef?.current || floating

    const clientTop = floating.clientTop || scrollEl.clientTop
    const floatingIsBordered = floating.clientTop !== 0
    const scrollElIsBordered = scrollEl.clientTop !== 0
    const floatingIsScrollEl = floating === scrollEl

    if (!item || index == null) {
      onFallbackChange?.(true)
      return {}
    }

    // use the offset middleware to compute the y position that aligns
    // the selected item's center with the reference's center
    const nextArgs = {
      ...state,
      ...(await offset(
        -item.offsetTop -
          floating.clientTop -
          rects.reference.height / 2 -
          item.offsetHeight / 2 -
          innerOffset
      ).fn(state)),
    }

    const detectOverflowOptions = { padding }

    const overflow = await detectOverflow(
      getArgsWithCustomFloatingHeight(
        nextArgs,
        scrollEl.scrollHeight + clientTop + floating.clientTop
      ),
      detectOverflowOptions
    )

    const refOverflow = await detectOverflow(nextArgs, {
      ...detectOverflowOptions,
      elementContext: 'reference',
    })

    const diffY = Math.max(0, overflow.top)
    const nextY = nextArgs.y + diffY
    const isScrollable = scrollEl.scrollHeight > scrollEl.clientHeight
    const rounder = isScrollable ? (v: number) => v : Math.round

    const maxHeight = rounder(
      Math.max(
        0,
        scrollEl.scrollHeight +
          ((floatingIsBordered && floatingIsScrollEl) || scrollElIsBordered
            ? clientTop * 2
            : 0) -
          diffY -
          Math.max(0, overflow.bottom)
      )
    )

    scrollEl.style.maxHeight = `${maxHeight}px`
    scrollEl.scrollTop = diffY

    // check if we should fall back to standard positioning
    if (onFallbackChange) {
      const shouldFallback =
        scrollEl.offsetHeight <
          item.offsetHeight * Math.min(minItemsVisible, listRef.current?.length ?? 0) -
            1 ||
        refOverflow.top >= -referenceOverflowThreshold ||
        refOverflow.bottom >= -referenceOverflowThreshold

      ReactDOM.flushSync(() => onFallbackChange(shouldFallback))
    }

    if (overflowRef) {
      ;(overflowRef as any).current = await detectOverflow(
        getArgsWithCustomFloatingHeight(
          { ...nextArgs, y: nextY },
          scrollEl.offsetHeight + clientTop + floating.clientTop
        ),
        detectOverflowOptions
      )
    }

    return {
      y: nextY,
    }
  },
})
