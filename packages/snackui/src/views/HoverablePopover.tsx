import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { useDebounce } from '../hooks/useDebounce'
import { isTouchDevice } from '../platform'
import { Hoverable } from './Hoverable'
import { Popover } from './Popover'
import { PopoverProps } from './PopoverProps'

export type HoverablePopoverRef = {
  close: () => void
}

export type HoverablePopoverProps = PopoverProps & {
  delay?: number
  allowHoverOnContent?: boolean
}

export const HoverablePopover = forwardRef<HoverablePopoverRef, HoverablePopoverProps>(
  ({ children, allowHoverOnContent, contents, delay, ...props }, ref) => {
    // TODO: make this optionally or default a tap action
    if (isTouchDevice) {
      return null
    }

    const [isHovering, set] = useState(false)
    delay = delay ?? (allowHoverOnContent ? 250 : 0)
    const setIsntHoveringSlow = useDebounce(() => set(false), delay / 2)
    const setIsHoveringSlow = useDebounce(() => set(true), delay)
    const cancelAll = () => {
      setIsHoveringSlow.cancel()
      setIsntHoveringSlow.cancel()
    }

    useImperativeHandle(ref, () => ({
      close: () => {
        set(false)
      },
    }))

    const setIsntHovering = () => {
      cancelAll()
      setIsntHoveringSlow()
    }
    const setIsHovering = () => {
      cancelAll()
      setIsHoveringSlow()
    }

    const popoverContent = allowHoverOnContent ? (
      typeof contents === 'function' ? (
        (isOpen) => (
          <Hoverable onHoverIn={setIsHovering} onHoverOut={setIsntHovering}>
            {contents(isOpen)}
          </Hoverable>
        )
      ) : (
        <Hoverable onHoverIn={setIsHovering} onHoverOut={setIsntHovering}>
          {contents}
        </Hoverable>
      )
    ) : (
      contents
    )

    return (
      <Popover
        isOpen={isHovering}
        overlayPointerEvents={false}
        overlay={false}
        contents={popoverContent}
        {...props}
      >
        <Hoverable onHoverIn={setIsHovering} onHoverOut={setIsntHovering}>
          {children}
        </Hoverable>
      </Popover>
    )
  }
)
