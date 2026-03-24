import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useEvent } from '@tamagui/use-event'
import type {
  ElementProps,
  FloatingInteractionContext,
  UseInnerOffsetProps,
} from './types'

// ported from floating-ui/react/_deprecated-inner.ts useInnerOffset
// changes the inner middleware's offset upon wheel events to expand the
// floating element's height, revealing more list items.
export function useInnerOffset(
  context: FloatingInteractionContext,
  props: UseInnerOffsetProps
): ElementProps {
  const { open, elements } = context
  const { enabled = true, overflowRef, scrollRef, onChange: unstable_onChange } = props

  const onChange = useEvent(unstable_onChange)
  const controlledScrollingRef = React.useRef(false)
  const prevScrollTopRef = React.useRef<number | null>(null)
  const initialOverflowRef = React.useRef<any>(null)

  React.useEffect(() => {
    if (!enabled) return

    function onWheel(e: WheelEvent) {
      if (e.ctrlKey || !el || overflowRef.current == null) {
        return
      }

      const dY = e.deltaY
      const isAtTop = overflowRef.current.top >= -0.5
      const isAtBottom = overflowRef.current.bottom >= -0.5
      const remainingScroll = el.scrollHeight - el.clientHeight
      const sign = dY < 0 ? -1 : 1
      const method = dY < 0 ? 'max' : 'min'

      if (el.scrollHeight <= el.clientHeight) {
        return
      }

      if ((!isAtTop && dY > 0) || (!isAtBottom && dY < 0)) {
        e.preventDefault()
        ReactDOM.flushSync(() => {
          onChange((d: number) => d + Math[method](dY, remainingScroll * sign))
        })
      } else if (/firefox/i.test(navigator.userAgent)) {
        // propagate scrolling during momentum phase once limited by boundary
        el.scrollTop += dY
      }
    }

    const el = scrollRef?.current || elements.floating

    if (open && el) {
      el.addEventListener('wheel', onWheel)

      // wait for the position to be ready
      requestAnimationFrame(() => {
        prevScrollTopRef.current = el.scrollTop

        if (overflowRef.current != null) {
          initialOverflowRef.current = { ...overflowRef.current }
        }
      })

      return () => {
        prevScrollTopRef.current = null
        initialOverflowRef.current = null
        el.removeEventListener('wheel', onWheel)
      }
    }
  }, [enabled, open, elements.floating, overflowRef, scrollRef, onChange])

  const floating: ElementProps['floating'] = React.useMemo(
    () => ({
      onKeyDown() {
        controlledScrollingRef.current = true
      },
      onWheel() {
        controlledScrollingRef.current = false
      },
      onPointerMove() {
        controlledScrollingRef.current = false
      },
      onScroll() {
        const el = scrollRef?.current || elements.floating

        if (!overflowRef.current || !el || !controlledScrollingRef.current) {
          return
        }

        if (prevScrollTopRef.current !== null) {
          const scrollDiff = el.scrollTop - prevScrollTopRef.current

          if (
            (overflowRef.current.bottom < -0.5 && scrollDiff < -1) ||
            (overflowRef.current.top < -0.5 && scrollDiff > 1)
          ) {
            ReactDOM.flushSync(() => onChange((d: number) => d + scrollDiff))
          }
        }

        // [firefox] wait for the height change to have been applied
        requestAnimationFrame(() => {
          prevScrollTopRef.current = el!.scrollTop
        })
      },
    }),
    [elements.floating, onChange, overflowRef, scrollRef]
  )

  return React.useMemo(() => (enabled ? { floating } : {}), [enabled, floating])
}
