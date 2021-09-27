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

export type HoverablePopoverProps = Omit<IPopoverProps> & {
  delay?: number
  fallbackToPress?: boolean
  allowHoverOnContent?: boolean
}

export const HoverablePopover = forwardRef<HoverablePopoverRef, HoverablePopoverProps>(
  (props, ref) => {
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
      return props.trigger({}, { open: false })
    }

    const setIsntHovering = () => {
      cancelAll()
      setIsntHoveringSlow()
    }
    const setIsHovering = () => {
      cancelAll()
      setIsHoveringSlow()
    }

    return (
      <Popover
        isOpen={isHovering}
        {...props}
        trigger={(triggerProps, state) => (
          <HoverOrPress
            onActive={setIsHovering}
            onInactive={setIsntHovering}
            fallbackToPress={props.fallbackToPress}
          >
            {props.trigger(triggerProps, state)}
          </HoverOrPress>
        )}
      >
        <Popover.Content>
          {isTouchDevice && props.fallbackToPress ? (
            props.children
          ) : props.allowHoverOnContent ? (
            <HoverOrPress onActive={setIsHovering} onInactive={setIsntHovering}>
              {props.children}
            </HoverOrPress>
          ) : (
            props.children
          )}
        </Popover.Content>
      </Popover>
    )
  }
)

const HoverOrPress = (props: {
  fallbackToPress?: boolean
  onActive?: () => void
  onInactive?: () => void
  children?: any
}) => {
  if (isTouchDevice) {
    if (!props.fallbackToPress) {
      return props.children
    }
    return (
      <Pressable onPressIn={props.onActive} onPressOut={props.onInactive}>
        {props.children}
      </Pressable>
    )
  } else {
    return (
      <Hoverable onHoverIn={props.onActive} onHoverOut={props.onInactive}>
        {props.children}
      </Hoverable>
    )
  }
}
