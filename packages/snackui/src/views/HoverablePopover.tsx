import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Pressable } from 'react-native'

import { useDebounce } from '../hooks/useDebounce'
import { isTouchDevice } from '../platform'
import { Hoverable } from './Hoverable'
import { Popover } from './Popover/Popover'
import { IPopoverProps } from './Popover/types'

export type HoverablePopoverRef = {
  close: () => void
}

export type HoverablePopoverProps = IPopoverProps & {
  delay?: number
  fallbackToPress?: boolean
  allowHoverOnContent?: boolean
}

export const HoverablePopover = forwardRef<HoverablePopoverRef, HoverablePopoverProps>(
  (props, ref) => {
    const { trigger } = props
    const [isHovering, set] = useState(false)
    const delay = props.delay ?? (props.allowHoverOnContent ? 250 : 0)
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

    if (isTouchDevice && !props.fallbackToPress) {
      return props.trigger({} as any, { open: false })
    }

    const setIsntHovering = () => {
      cancelAll()
      setIsntHoveringSlow()
    }
    const setIsHovering = () => {
      cancelAll()
      setIsHoveringSlow()
    }

    const InteractiveComponent = (componentProps: any) => {
      if (isTouchDevice) {
        if (props.fallbackToPress) {
          return (
            <Pressable onPressIn={setIsHovering} onPressOut={setIsntHovering} {...componentProps} />
          )
        }
        return null
      } else {
        return (
          <Hoverable onHoverIn={setIsHovering} onHoverOut={setIsntHovering} {...componentProps} />
        )
      }
    }

    return (
      <Popover
        isOpen={isHovering}
        {...props}
        trigger={(props, state) => (
          <InteractiveComponent>{trigger(props, state)}</InteractiveComponent>
        )}
      >
        {isTouchDevice && props.fallbackToPress ? (
          props.children
        ) : props.allowHoverOnContent ? (
          <InteractiveComponent>{props.children}</InteractiveComponent>
        ) : (
          props.children
        )}
      </Popover>
    )
  }
)
