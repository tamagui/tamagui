import { autoUpdate, offset, useFloating } from '@floating-ui/react-dom-interactions'
import { useComposedRefs } from '@tamagui/compose-refs'
import { TamaguiElement, useIsomorphicLayoutEffect } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import { flushSync } from 'react-dom'

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
      const { floatingRef, forceUpdate, open, fallback, setScrollTop, setInnerOffset, ...context } =
        useSelectContext(componentName, __scopeSelect)

      const [element, setElement] = React.useState<HTMLElement | null>(null)
      const statusRef = React.useRef<'idle' | 'active'>('idle')
      const isVisible = context[dir === 'down' ? 'canScrollDown' : 'canScrollUp']
      const frameRef = React.useRef<any>()

      const { x, y, reference, floating, strategy, update, refs } = useFloating({
        strategy: 'fixed',
        placement: dir === 'up' ? 'top' : 'bottom',
        middleware: [offset(({ rects }) => -rects.floating.height)],
        whileElementsMounted: (...args) => autoUpdate(...args, { animationFrame: true }),
      })

      const composedRef = useComposedRefs(forwardedRef, floating)

      if (floatingRef) {
        if (open) {
          if (element !== floatingRef.current) {
            setElement(floatingRef.current)
            reference(floatingRef.current)
            requestAnimationFrame(update)
          }
        } else {
          cancelAnimationFrame(frameRef.current)
        }
      }

      useIsomorphicLayoutEffect(() => {
        return () => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          cancelAnimationFrame(frameRef.current)
        }
      }, [])

      if (!isVisible || !floatingRef) {
        return null
      }

      const onScroll = (amount: number) => {
        if (fallback) {
          if (refs.floating.current) {
            refs.floating.current.scrollTop -= amount
            flushSync(() => setScrollTop!(refs.floating.current?.scrollTop ?? 0))
          }
        } else {
          flushSync(() => setInnerOffset!((value) => value - amount))
        }
      }

      return (
        <YStack
          ref={composedRef}
          componentName={componentName}
          aria-hidden
          {...scrollIndicatorProps}
          zIndex={1000}
          // @ts-expect-error
          position={strategy}
          left={x || 0}
          top={y || 0}
          width={`calc(${(floatingRef?.current?.offsetWidth ?? 0) - 2}px)`}
          onPointerEnter={() => {
            statusRef.current = 'active'
            let prevNow = Date.now()

            function frame() {
              if (element) {
                const currentNow = Date.now()
                const msElapsed = currentNow - prevNow
                prevNow = currentNow

                const pixelsToScroll = msElapsed / 2

                const remainingPixels =
                  dir === 'up'
                    ? element.scrollTop
                    : element.scrollHeight - element.clientHeight - element.scrollTop

                const scrollRemaining =
                  dir === 'up'
                    ? element.scrollTop - pixelsToScroll > 0
                    : element.scrollTop + pixelsToScroll <
                      element.scrollHeight - element.clientHeight

                onScroll(
                  dir === 'up'
                    ? Math.min(pixelsToScroll, remainingPixels)
                    : Math.max(-pixelsToScroll, -remainingPixels)
                )

                if (scrollRemaining) {
                  frameRef.current = requestAnimationFrame(frame)
                }
              }
            }

            cancelAnimationFrame(frameRef.current)
            frameRef.current = requestAnimationFrame(frame)
          }}
          onPointerLeave={() => {
            statusRef.current = 'idle'
            cancelAnimationFrame(frameRef.current)
          }}
        />
      )
    }
  )
)
