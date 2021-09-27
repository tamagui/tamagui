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
    const [isActive, set] = useState(false)
    const delay = props.delay ?? (props.allowHoverOnContent ? 250 : 0)
    const setOffSlow = useDebounce(() => set(false), delay / 2)
    const setOnSlow = useDebounce(() => set(true), delay)
    const cancelAll = () => {
      setOnSlow.cancel()
      setOffSlow.cancel()
    }

    useImperativeHandle(ref, () => ({
      close: () => {
        set(false)
      },
    }))

    if (isTouchDevice && !props.fallbackToPress) {
      return props.trigger(null as any, { open: false })
    }

    const setOff = () => {
      cancelAll()
      setOffSlow()
    }
    const setOn = () => {
      cancelAll()
      setOnSlow()
    }

    return (
      <Popover
        isOpen={isActive}
        {...props}
        trigger={(triggerProps, state) => (
          <HoverOrToggle
            onActive={setOn}
            onInactive={setOff}
            fallbackToPress={props.fallbackToPress}
          >
            {props.trigger(triggerProps, state)}
          </HoverOrToggle>
        )}
      >
        <Popover.Content>
          {isTouchDevice && props.fallbackToPress ? (
            props.children
          ) : props.allowHoverOnContent ? (
            <HoverOrToggle onActive={setOn} onInactive={setOff}>
              {props.children}
            </HoverOrToggle>
          ) : (
            props.children
          )}
        </Popover.Content>
      </Popover>
    )
  }
)

const HoverOrToggle = (props: {
  fallbackToPress?: boolean
  onActive?: () => void
  onInactive?: () => void
  children?: any
}) => {
  if (isTouchDevice) {
    const [isOn, setIsOn] = useState(false)

    if (!props.fallbackToPress) {
      return props.children
    }
    return (
      <Pressable onPress={() => {
        setIsOn(x => {
          const  next = !x
          next ? props.onActive?.() : props.onInactive?.()
          return next
        })
      }}>
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
