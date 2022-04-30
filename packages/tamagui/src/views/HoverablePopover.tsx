import { AnimatePresence } from '@tamagui/animate-presence'
import { useIsTouchDevice, withStaticProperties } from '@tamagui/core'
import { useDebounce } from '@tamagui/use-debounce'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { Hoverable, HoverableHandle } from './Hoverable'
import { HoverOrToggle } from './HoverOrToggle'
import { Popover } from './Popover/Popover'
import { IPopoverProps } from './Popover/types'
import { PopperArrow } from './Popper/PopperArrow'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type HoverablePopoverHandle = {
  close: () => void
}

export type HoverablePopoverProps = IPopoverProps & {
  delay?: number
  fallbackToPress?: boolean
  allowHoverOnContent?: boolean
  disableUntilSettled?: boolean
}

export const HoverablePopover = withStaticProperties(
  forwardRef<HoverablePopoverHandle, HoverablePopoverProps>(
    (
      {
        trigger,
        delay = 0,
        children,
        allowHoverOnContent,
        fallbackToPress,
        disableUntilSettled,
        ...props
      },
      ref
    ) => {
      const hoverableRef = useRef<HoverableHandle>(null)
      const [isActive, set] = useState(false)
      const isTouchDevice = useIsTouchDevice()

      // these are debounced only to allow jump betewen target/trigger
      // ..and to make content trigger faster than trigger
      // todo subtract from inner delay
      const setOffSlow = useDebounce(() => set(false), allowHoverOnContent ? 20 : 0)
      const setOnSlow = useDebounce(() => set(true), allowHoverOnContent ? 40 : 0)
      const cancelAll = () => {
        setOnSlow.cancel()
        setOffSlow.cancel()
      }

      const setOff = () => {
        cancelAll()
        setOffSlow()
      }
      const setOn = () => {
        cancelAll()
        setOnSlow()
      }

      useImperativeHandle(ref, () => ({
        close: () => {
          cancelAll()
          set(false)
          hoverableRef.current?.close()
        },
      }))

      // ssr issue
      if (isTouchDevice && !fallbackToPress) {
        return trigger(null as any, { open: false })
      }

      return (
        <Popover
          isOpen={isActive}
          {...props}
          trigger={(triggerProps, state) => {
            return (
              <HoverOrToggle
                ref={hoverableRef}
                disableUntilSettled={disableUntilSettled}
                onHoverIn={setOn}
                onHoverOut={setOff}
                hoverDelay={delay}
              >
                {trigger(triggerProps, state)}
              </HoverOrToggle>
            )
          }}
        >
          {(openProps) => {
            const childrenElements = (
              <AnimatePresence>
                {typeof children === 'function'
                  ? children(openProps)
                  : openProps.open
                  ? children
                  : null}
              </AnimatePresence>
            )
            return (
              <Popover.Content>
                {isTouchDevice && fallbackToPress ? (
                  children
                ) : allowHoverOnContent ? (
                  <Hoverable onHoverIn={setOn} onHoverOut={setOff}>
                    {childrenElements}
                  </Hoverable>
                ) : (
                  childrenElements
                )}
              </Popover.Content>
            )
          }}
        </Popover>
      )
    }
  ),
  {
    Arrow: PopperArrow,
  }
)
