import { autoUpdate, offset, useFloating } from '@floating-ui/react-dom-interactions'
import { useComposedRefs } from '@tamagui/compose-refs'
import { TamaguiElement } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'

import { SCROLL_ARROW_THRESHOLD, SCROLL_ARROW_VELOCITY } from './constants'
import { useSelectContext } from './context'
import { ScopedProps, SelectScrollButtonImplProps, SelectScrollButtonProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SelectScrollUpButton
 * -----------------------------------------------------------------------------------------------*/

const SCROLL_UP_BUTTON_NAME = 'SelectScrollUpButton'

export const SelectScrollUpButton = React.forwardRef<TamaguiElement, SelectScrollButtonProps>(
  (props: ScopedProps<SelectScrollButtonProps>, forwardedRef) => {
    return (
      <SelectScrollButtonImpl
        componentName={SCROLL_UP_BUTTON_NAME}
        {...props}
        dir="up"
        ref={forwardedRef}
      />
    )
  }
)

SelectScrollUpButton.displayName = SCROLL_UP_BUTTON_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectScrollDownButton
 * -----------------------------------------------------------------------------------------------*/

const SCROLL_DOWN_BUTTON_NAME = 'SelectScrollDownButton'

export const SelectScrollDownButton = React.forwardRef<TamaguiElement, SelectScrollButtonProps>(
  (props: ScopedProps<SelectScrollButtonProps>, forwardedRef) => {
    return (
      <SelectScrollButtonImpl
        componentName={SCROLL_DOWN_BUTTON_NAME}
        {...props}
        dir="down"
        ref={forwardedRef}
      />
    )
  }
)

SelectScrollDownButton.displayName = SCROLL_DOWN_BUTTON_NAME

type SelectScrollButtonImplElement = TamaguiElement

const SelectScrollButtonImpl = React.memo(
  React.forwardRef<SelectScrollButtonImplElement, SelectScrollButtonImplProps>(
    (props: ScopedProps<SelectScrollButtonImplProps>, forwardedRef) => {
      const { __scopeSelect, dir, componentName, ...scrollIndicatorProps } = props
      const { floatingRef, increaseHeight, forceUpdate, ...context } = useSelectContext(
        componentName,
        __scopeSelect
      )
      const intervalRef = React.useRef<any>()
      const loopingRef = React.useRef(false)
      const isVisible = context[dir === 'down' ? 'canScrollDown' : 'canScrollUp']

      const { x, y, reference, floating, strategy, update, refs } = useFloating({
        strategy: 'fixed',
        placement: dir === 'up' ? 'top' : 'bottom',
        middleware: [offset(({ rects }) => -rects.floating.height)],
      })

      const composedRefs = useComposedRefs(forwardedRef, floating)

      React.useLayoutEffect(() => {
        if (!floatingRef) return
        reference(floatingRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [reference, floatingRef?.current])

      React.useEffect(() => {
        if (!refs.reference.current || !refs.floating.current || !isVisible) {
          return
        }

        const cleanup = autoUpdate(refs.reference.current, refs.floating.current, update, {
          animationFrame: true,
        })

        return () => {
          clearInterval(intervalRef.current)
          loopingRef.current = false
          cleanup()
        }
      }, [isVisible, update, refs.floating, refs.reference])

      if (!isVisible) {
        return null
      }

      const handleScrollArrowChange = () => {
        if (!floatingRef) return
        const floating = floatingRef.current
        const isUp = dir === 'up'

        if (floating) {
          const value = isUp ? -SCROLL_ARROW_VELOCITY : SCROLL_ARROW_VELOCITY
          const multi =
            (isUp && floating.scrollTop <= SCROLL_ARROW_THRESHOLD * 2) ||
            (!isUp &&
              floating.scrollTop >=
                floating.scrollHeight - floating.clientHeight - SCROLL_ARROW_THRESHOLD * 2)
              ? 2
              : 1

          floating.scrollTop += multi * (isUp ? -SCROLL_ARROW_VELOCITY : SCROLL_ARROW_VELOCITY)

          increaseHeight?.(floating, multi === 2 ? value * 2 : value)
          // Ensure derived data (scroll arrows) is fresh
          forceUpdate()
        }
      }

      return (
        <YStack
          ref={composedRefs}
          componentName={componentName}
          aria-hidden
          {...scrollIndicatorProps}
          zIndex={1000}
          // @ts-expect-error
          position={strategy}
          left={x || 0}
          top={y || 0}
          width={`calc(${(floatingRef?.current?.offsetWidth ?? 0) - 2}px)`}
          onPointerMove={() => {
            if (!loopingRef.current) {
              intervalRef.current = setInterval(handleScrollArrowChange, 1000 / 60)
              loopingRef.current = true
            }
          }}
          onPointerLeave={() => {
            loopingRef.current = false
            clearInterval(intervalRef.current)
          }}
        />
      )
    }
  )
)
