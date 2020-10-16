import React, { useState } from 'react'

import { useDebounce } from '../hooks/useDebounce'
import { Hoverable } from './Hoverable'
import { Popover } from './Popover'
import { PopoverProps } from './PopoverProps'

export const HoverablePopover = ({
  children,
  allowHoverOnContent,
  contents,
  delay,
  ...props
}: PopoverProps & {
  delay?: number
  allowHoverOnContent?: boolean
}) => {
  const [isHovering, set] = useState(false)
  delay = delay ?? (allowHoverOnContent ? 250 : 0)
  const setIsntHoveringSlow = useDebounce(() => set(false), delay / 2)
  const setIsHoveringSlow = useDebounce(() => set(true), delay)
  const cancelAll = () => {
    setIsHoveringSlow.cancel()
    setIsntHoveringSlow.cancel()
  }
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
